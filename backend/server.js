import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { toNodeHandler } from 'better-auth/node';
import { auth, hashPassword, verifyPassword } from '../src/lib/auth.ts';
import { createPool } from '../src/db/index.ts';
import { 
    registerUser, 
    loginUser, 
    getSaasState, 
    upsertSite, 
    deleteSite, 
    insertTeamMember, 
    deleteTeamMember,
    insertDomain,
    insertMedia,
    insertLead,
    updateLeadStatus
} from '../src/db/queries.ts';
import { uploadToR2, deleteFromR2, isR2Live, getObjectFromR2 } from './services/r2Storage.js';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const pool = createPool();

// -------------------------------------------------------------
// BETTER AUTH CORE HANDLER
// -------------------------------------------------------------
app.all('/api/auth/*', toNodeHandler(auth));

// -------------------------------------------------------------
// AUTH TOKEN HELPER & MIDDLEWARE
// -------------------------------------------------------------
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id || user.uid, 
            email: user.email, 
            role: user.role, 
            plan: user.plan 
        }, 
        process.env.JWT_SECRET || 'riga_enterprise_saas_secret_99', 
        { expiresIn: '30d' }
    );
};

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'riga_enterprise_saas_secret_99');
            
            // Check "user" table or "users"
            const result = await pool.query('SELECT * FROM "user" WHERE id = $1', [decoded.id]);
            if (result.rows.length > 0) {
                req.user = result.rows[0];
                return next();
            }
            
            const legacyRes = await pool.query('SELECT * FROM "users" WHERE uid = $1 OR id::text = $1', [decoded.id]);
            if (legacyRes.rows.length > 0) {
                req.user = legacyRes.rows[0];
                return next();
            }

            return res.status(401).json({ message: 'User not found in Neon database.' });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired authorization token.' });
        }
    }
    
    // Check Better Auth session cookie if header wasn't sent
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (session && session.user) {
            req.user = session.user;
            return next();
        }
    } catch (e) {}

    return res.status(401).json({ message: 'Authentication required. No token provided.' });
};

// -------------------------------------------------------------
// SYSTEM STATUS / HEALTH CHECK
// -------------------------------------------------------------
app.get('/', (req, res) => {
    res.json({
        name: "Riga SaaS Enterprise Control Plane",
        version: "2.5.0-enterprise",
        framework: "Better Auth + Neon PostgreSQL + Cloudflare R2",
        auth: "Better Auth (Organizations, Workspaces, RBAC, Hashed Credentials)",
        database: "Neon PostgreSQL",
        storage: isR2Live() ? "Cloudflare R2 (Live Production)" : "Cloudflare R2 (Connected)",
        endpoints: [
            "/api/auth/*",
            "/api/auth/register",
            "/api/auth/login",
            "/api/saas/state",
            "/api/saas/sites",
            "/api/saas/organizations",
            "/api/saas/billing/subscription",
            "/api/media/upload"
        ]
    });
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES (Better Auth + Neon DB Single Source of Truth)
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await registerUser({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            _id: user.id || user.uid,
            uid: user.id || user.uid,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
            organizationId: user.organizationId,
            workspace: user.workspace,
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await loginUser({ email, password });
        const token = generateToken(user);

        res.json({
            success: true,
            _id: user.id || user.uid,
            uid: user.id || user.uid,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
            organization: user.organization,
            token
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

app.get('/api/auth/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// SAAS STATE (Unified Multi-Tenant State from Neon DB)
// -------------------------------------------------------------
app.get('/api/saas/state', async (req, res) => {
    try {
        const userId = req.query.userId || req.headers['x-user-id'] || '';
        const state = await getSaasState(String(userId));
        res.json(state);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// SITES & CLOUDFLARE R2 OBJECT STORAGE PIPELINE
// -------------------------------------------------------------
app.get('/api/sites', protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user.uid;
        const result = await pool.query('SELECT * FROM sites WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post(['/api/sites', '/api/saas/sites'], async (req, res) => {
    try {
        const data = req.body.data || req.body;
        const userId = data.userId || (req.user ? (req.user.id || req.user.uid) : 'usr_owner');
        const cleanName = (data.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const subdomain = data.subdomain || `${cleanName}-${Math.floor(Math.random() * 1000)}.riga.site`;

        // 1. Upload compiled HTML to Cloudflare R2
        const r2Key = `sites/${subdomain}/index.html`;
        const htmlToUpload = data.htmlContent || `<html><body><h1>Welcome to ${data.name || 'Website'}</h1></body></html>`;
        const r2Result = await uploadToR2(r2Key, htmlToUpload, 'text/html');

        // 2. Persist with Full JSON AST and HTML Content in Neon PostgreSQL
        await upsertSite({
            ...data,
            subdomain,
            userId,
            htmlContent: data.htmlContent,
            jsonData: data.jsonData,
            status: data.status || 'published'
        });

        const state = await getSaasState(userId);
        res.json({
            status: 'success',
            db: state,
            r2Storage: r2Result,
            subdomain,
            message: 'Site created and compiled to Cloudflare R2 & Neon PostgreSQL'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/saas/sites/delete', async (req, res) => {
    try {
        const { id, subdomain, userId } = req.body;
        if (subdomain) {
            await deleteFromR2(`sites/${subdomain}/index.html`);
        }
        await deleteSite(id);
        const state = await getSaasState(userId || '');
        res.json({ status: 'success', db: state });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// WORKSPACES & ORGANIZATIONS (Better Auth RBAC Multi-Tenancy)
// -------------------------------------------------------------
app.get('/api/saas/organizations', async (req, res) => {
    try {
        const userId = req.query.userId || (req.user ? (req.user.id || req.user.uid) : '');
        const result = await pool.query(`
            SELECT o.*, m.role 
            FROM "organization" o
            JOIN "member" m ON m.organization_id = o.id
            WHERE m.user_id = $1
            ORDER BY o.created_at DESC
        `, [userId]);
        res.json({ status: 'success', organizations: result.rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/saas/organizations', async (req, res) => {
    try {
        const { name, userId } = req.body;
        const orgId = 'org_' + Date.now();
        const slug = (name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
        
        await pool.query('INSERT INTO "organization" (id, name, slug) VALUES ($1, $2, $3)', [orgId, name, slug]);
        await pool.query('INSERT INTO "member" (id, organization_id, user_id, role) VALUES ($1, $2, $3, $4)', [
            'mem_' + Date.now(), orgId, userId || 'usr_owner', 'owner'
        ]);

        res.json({ status: 'success', organization: { id: orgId, name, slug, role: 'owner' } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Team Members (Workspace RBAC)
app.post('/api/saas/team', async (req, res) => {
    try {
        const { name, email, role, ownerId, organizationId } = req.body;
        await insertTeamMember({ name, email, role, ownerId, organizationId });
        const state = await getSaasState(ownerId || '');
        res.json({ status: 'success', db: state });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/saas/team/delete', async (req, res) => {
    try {
        const { id, ownerId } = req.body;
        await deleteTeamMember(id);
        const state = await getSaasState(ownerId || '');
        res.json({ status: 'success', db: state });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// ENTERPRISE BILLING & TIERS (Shopify / WordPress Grade)
// -------------------------------------------------------------
app.get('/api/saas/billing/plans', (req, res) => {
    res.json({
        plans: [
            {
                id: 'starter',
                name: 'Starter Solo',
                price: '$19',
                period: '/month',
                description: 'Ideal for single storefronts and individual creators.',
                sites: '3 Hosted Sites',
                seats: '1 Team Member',
                storage: '10 GB Cloudflare R2',
                features: ['Custom Domains with Free SSL', 'Standard Theme Ast', 'Edge CDN Delivery', 'Community Support']
            },
            {
                id: 'pro',
                name: 'WordPress Pro SaaS',
                popular: true,
                price: '$49',
                period: '/month',
                description: 'Shopify-grade multi-tenant powerhouse with Better Auth RBAC.',
                sites: '20 Hosted Sites',
                seats: '5 Team Workspaces',
                storage: '50 GB Cloudflare R2',
                features: ['Unlimited Funnel Ast Saves', 'Role-Based Access Control', 'Instant Cloudflare Purge', 'Custom Code Injection', 'Priority 24/7 SLA']
            },
            {
                id: 'enterprise',
                name: 'Riga Enterprise Multi-Tenant',
                price: '$199',
                period: '/month',
                description: 'Full multi-organization enterprise cluster with white-label domains.',
                sites: 'Unlimited Sites',
                seats: 'Unlimited Seats',
                storage: '1 TB Cloudflare R2',
                features: ['Multi-Region Edge Nodes', 'Custom SSL Certificates', 'Audit Logging & Webhooks', 'Dedicated Account Manager', 'Custom SSO & SAML']
            }
        ]
    });
});

app.post('/api/saas/billing/upgrade', async (req, res) => {
    try {
        const { plan, userId } = req.body;
        await pool.query('UPDATE "user" SET plan = $1, updated_at = NOW() WHERE id = $2', [plan, userId]);
        await pool.query('UPDATE "subscriptions" SET plan = $1, current_period_end = NOW() + INTERVAL \'30 days\' WHERE user_id = $2', [plan, userId]);
        
        const state = await getSaasState(userId);
        res.json({ status: 'success', message: `Plan upgraded to ${plan}!`, db: state });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// MEDIA UPLOAD TO CLOUDFLARE R2 & NEON DB
// -------------------------------------------------------------
app.get('/api/media/proxy', async (req, res) => {
    try {
        const key = req.query.key;
        if (!key) return res.status(400).json({ message: 'Media key is required' });
        
        const obj = await getObjectFromR2(String(key));
        if (obj.ContentType) {
            res.setHeader('Content-Type', obj.ContentType);
        }
        res.setHeader('Cache-Control', 'public, max-age=86400');
        if (obj.Body) {
            obj.Body.pipe(res);
        } else {
            res.status(404).json({ message: 'Media object not found in R2' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/media/upload', async (req, res) => {
    try {
        const { filename, fileData, contentType, category, userId } = req.body;
        const r2Key = `media/${Date.now()}_${filename || 'asset.png'}`;
        
        const buffer = Buffer.from(fileData ? fileData.split(',')[1] || fileData : '', 'base64');
        const r2Result = await uploadToR2(r2Key, buffer, contentType || 'image/png');

        await insertMedia({
            title: filename || 'Uploaded Media',
            url: r2Result.url || `https://pub-r2.riga.site/${r2Key}`,
            type: contentType || 'image/png',
            size: `${Math.round(buffer.length / 1024)} KB`,
            dimensions: '1200 x 800',
            category: category || 'General',
            userId: userId || 'usr_owner'
        });

        res.status(201).json({
            success: true,
            r2Storage: r2Result,
            url: r2Result.url,
            message: 'Media saved to Cloudflare R2 and Neon DB'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Riga Enterprise SaaS Server running on port ${PORT}`);
    console.log(`🔐 Better Auth enabled with Neon PostgreSQL & Cloudflare R2`);
});

export default app;
