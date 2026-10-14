import fs from 'fs';
import path from 'path';
import { db, isDbConfigured, pool } from './index.ts';
import { users, sites, team, domains, media, leads, user as userTable, account as accountTable, organization as orgTable, member as memberTable, subscriptions as subTable } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../lib/auth.ts';

const saasDbPath = path.resolve(process.cwd(), 'saas_db.json');

function getLocalSaasDb() {
  if (fs.existsSync(saasDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(saasDbPath, 'utf-8'));
    } catch {
      // fallback
    }
  }
  return {
    user: null,
    organization: null,
    subscription: null,
    sites: [],
    team: [],
    domains: [],
    media: [],
    leads: [],
    activity: []
  };
}

function saveLocalSaasDb(data: any) {
  try {
    fs.writeFileSync(saasDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('[AI Studio] Could not save local saas_db.json:', err);
  }
}

// Generate rich Shopify / WordPress grade default starter JSON AST
function getDefaultSiteJson(name: string, theme: string = 'standard/Y1_a_1_Column_Layout') {
  return {
    theme: theme.includes('/') ? theme.split('/').pop() : theme,
    name: 'PageElement',
    elementLists: [
      [
        {
          name: 'HeroElement',
          title: `Welcome to ${name}`,
          subtitle: 'Crafted with enterprise speed, global CDN edge delivery, and modern responsive design.',
          buttonText: 'Get Started Today',
          buttonLink: '#contact'
        },
        {
          name: 'FeatureGridElement',
          items: [
            { icon: 'bolt', title: 'Lightning Fast', text: 'Optimized static compilation delivered from Cloudflare R2 and Edge PoPs.' },
            { icon: 'shield_lock', title: 'Enterprise Security', text: 'Better Auth RBAC with multi-tenant workspace isolation.' },
            { icon: 'brush', title: 'Visual Customizer', text: 'Drag-and-drop live visual editor with granular style controls.' }
          ]
        },
        {
          name: 'ContactFormElement',
          title: 'Get In Touch',
          subtitle: 'Send us a message and our team will get back to you immediately.'
        }
      ]
    ]
  };
}

// Generate clean responsive starter HTML layout
function getDefaultSiteHtml(name: string, theme: string = 'standard/Y1_a_1_Column_Layout') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; background: #0f172a; color: #f8fafc; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    header { padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero { padding: 96px 0 64px; text-align: center; }
    .hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 20px; line-height: 1.15; }
    .hero p { font-size: 20px; color: #94a3b8; max-width: 680px; margin: 0 auto 36px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; background: #2563eb; color: #fff; font-weight: 600; padding: 14px 32px; border-radius: 9999px; text-decoration: none; transition: 0.2s ease; border: none; cursor: pointer; }
    .btn:hover { background: #1d4ed8; transform: translateY(-2px); }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; padding: 64px 0; }
    .feature-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; transition: 0.2s ease; }
    .feature-card:hover { border-color: rgba(56, 189, 248, 0.4); transform: translateY(-4px); }
    .feature-card h3 { font-size: 20px; margin-bottom: 12px; color: #f1f5f9; }
    .feature-card p { color: #94a3b8; font-size: 15px; }
    footer { padding: 48px 0; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 64px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">${name}</div>
      <a href="#contact" class="btn" style="padding: 10px 24px; font-size: 14px;">Contact Us</a>
    </header>
    <main>
      <section class="hero">
        <h1>Welcome to ${name}</h1>
        <p>A high-performance modern website built with Riga SaaS, Cloudflare R2 storage, and edge delivery.</p>
        <a href="#contact" class="btn">Explore Products</a>
      </section>
      <section class="features">
        <div class="feature-card">
          <h3>⚡ Ultra Fast</h3>
          <p>Global Edge CDN compilation for sub-50ms page loads worldwide.</p>
        </div>
        <div class="feature-card">
          <h3>🛡️ Enterprise Security</h3>
          <p>Powered by Neon PostgreSQL and Better Auth RBAC isolation.</p>
        </div>
        <div class="feature-card">
          <h3>🎨 High Customizability</h3>
          <p>Edit in real-time with visual canvas controls and responsive previews.</p>
        </div>
      </section>
    </main>
    <footer>
      <p>&copy; ${new Date().getFullYear()} ${name}. Powered by Riga Enterprise Cloud.</p>
    </footer>
  </div>
</body>
</html>`;
}

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  if (!isDbConfigured) {
    return {
      uid: uid || 'user_' + Date.now(),
      email: email || '',
      name: name || (email ? email.split('@')[0] : 'User'),
      role: 'Owner',
      plan: 'WordPress Pro SaaS Multi-Tenant'
    };
  }

  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }
    const inserted = await db.insert(users).values({
      uid,
      email,
      name: name || email.split('@')[0],
      role: 'Owner',
      plan: 'WordPress Pro SaaS Multi-Tenant',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.warn('Database query failed in getOrCreateUser:', error);
    return null;
  }
}

export async function getSaasState(userId: string = '') {
  if (!userId) {
    return {
      user: null,
      organization: null,
      subscription: null,
      sites: [],
      team: [],
      domains: [],
      media: [],
      leads: [],
      activity: []
    };
  }

  if (!isDbConfigured) {
    return getLocalSaasDb();
  }

  try {
    // 1. Fetch User (Check "user" table by id or email)
    let currentUser: any = null;
    try {
      const uRes = await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1);
      if (uRes.length > 0) {
        currentUser = uRes[0];
      } else {
        const uEmailRes = await db.select().from(userTable).where(eq(userTable.email, userId)).limit(1);
        if (uEmailRes.length > 0) currentUser = uEmailRes[0];
      }
    } catch (e) {}

    const resolvedUserId = currentUser ? currentUser.id : userId;

    // 2. Fetch User's Organization / Workspace
    let userOrg: any = null;
    try {
      const membership = await db.select().from(memberTable).where(eq(memberTable.userId, resolvedUserId)).limit(1);
      if (membership.length > 0) {
        const orgRes = await db.select().from(orgTable).where(eq(orgTable.id, membership[0].organizationId)).limit(1);
        if (orgRes.length > 0) {
          userOrg = {
            id: orgRes[0].id,
            name: orgRes[0].name,
            slug: orgRes[0].slug,
            role: membership[0].role
          };
        }
      }
    } catch (e) {}

    // 3. Fetch Active Subscription
    let currentSub: any = null;
    try {
      const subRes = await db.select().from(subTable).where(eq(subTable.userId, resolvedUserId)).limit(1);
      if (subRes.length > 0) {
        currentSub = subRes[0];
      }
    } catch (e) {}

    // 4. Fetch Sites, Team, Domains, Media, Leads
    const sitesList = await db.select().from(sites).where(eq(sites.userId, resolvedUserId)).orderBy(desc(sites.updatedAt));
    const teamList = await db.select().from(team).where(eq(team.ownerId, resolvedUserId)).orderBy(desc(team.createdAt));
    const domainList = await db.select().from(domains).where(eq(domains.userId, resolvedUserId)).orderBy(desc(domains.createdAt));
    const mediaList = await db.select().from(media).where(eq(media.userId, resolvedUserId)).orderBy(desc(media.uploadedAt));
    const leadsList = await db.select().from(leads).where(eq(leads.userId, resolvedUserId)).orderBy(desc(leads.createdAt));

    return {
      user: currentUser ? {
        id: currentUser.id || currentUser.uid,
        uid: currentUser.uid || currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role || 'Owner',
        plan: currentUser.plan || 'WordPress Pro SaaS'
      } : null,
      organization: userOrg || {
        id: 'org_default',
        name: `${currentUser?.name || 'My'} Workspace`,
        slug: 'main-workspace',
        role: 'Owner'
      },
      subscription: currentSub || {
        plan: currentUser?.plan || 'WordPress Pro SaaS',
        status: 'active',
        price: '$49/mo',
        seats: 5,
        storageGb: 50,
        sitesLimit: 20
      },
      sites: sitesList.map((s: any) => ({
        id: s.id,
        name: s.name,
        subdomain: s.subdomain,
        theme: s.theme,
        status: s.status,
        visitors: s.visitors,
        htmlContent: s.htmlContent || getDefaultSiteHtml(s.name, s.theme),
        jsonData: s.jsonData || JSON.stringify(getDefaultSiteJson(s.name, s.theme)),
        bundleSize: s.bundleSize || '42 KB',
        versionHash: s.versionHash || 'v1.0.0',
        updated: s.updatedAt ? s.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })),
      team: teamList.map((t: any) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        role: t.role,
        status: t.status
      })),
      domains: domainList.map((d: any) => ({
        id: d.id,
        site: d.site,
        domain: d.domain,
        type: d.type,
        ssl: d.ssl
      })),
      media: mediaList.map((m: any) => ({
        id: m.id,
        title: m.title,
        url: m.url,
        type: m.type,
        size: m.size,
        dimensions: m.dimensions,
        category: m.category,
        uploadedAt: m.uploadedAt ? m.uploadedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })),
      leads: leadsList.map((l: any) => ({
        id: l.id,
        site: l.site,
        formName: l.formName,
        name: l.name,
        email: l.email,
        message: l.message,
        date: l.createdAt ? l.createdAt.toISOString().slice(0, 16).replace('T', ' ') : new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: l.status
      }))
    };
  } catch (error) {
    console.warn('Database query failed in getSaasState, falling back to local database:', error);
    return getLocalSaasDb();
  }
}

// Register user with cryptographically hashed password & Better Auth integration
// Register user with cryptographically hashed password & Better Auth integration
export async function registerUser({ name, email, password }: { name?: string; email: string; password?: string }) {
  if (!isDbConfigured) {
    throw new Error('Neon database is not configured. Please set DATABASE_URL environment variable.');
  }

  // 1. Check existing user in Better Auth
  const existingUser = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error('User already exists with this email address.');
  }

  // 2. Hash password securely with bcrypt
  const plainPassword = password || 'Secret123!';
  const hashedPassword = await hashPassword(plainPassword);

  const userId = 'usr_' + Date.now();
  const userName = name || email.split('@')[0];

  // 3. Insert into Better Auth "user" table
  const insertedUser = await db.insert(userTable).values({
    id: userId,
    name: userName,
    email: email,
    emailVerified: true,
    role: 'Owner',
    plan: 'WordPress Pro SaaS',
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  // 4. Insert into Better Auth "account" table with hashed password
  await db.insert(accountTable).values({
    id: 'acc_' + Date.now(),
    accountId: email,
    providerId: 'credential',
    userId: userId,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 5. Sync to legacy "users" table without password
  try {
    await db.insert(users).values({
      uid: userId,
      email: email,
      name: userName,
      role: 'Owner',
      plan: 'Riga SaaS Enterprise',
    });
  } catch (e) {}

  // 6. Automatically create Better Auth Organization / Workspace for new user
  const orgId = 'org_' + Date.now();
  const orgSlug = `${userName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-workspace`;
  try {
    await db.insert(orgTable).values({
      id: orgId,
      name: `${userName}'s Workspace`,
      slug: orgSlug,
      createdAt: new Date(),
    });

    // Add user as Owner in organization
    await db.insert(memberTable).values({
      id: 'mem_' + Date.now(),
      organizationId: orgId,
      userId: userId,
      role: 'owner',
      createdAt: new Date(),
    });

    // Add active subscription
    await db.insert(subTable).values({
      id: 'sub_' + Date.now(),
      userId: userId,
      organizationId: orgId,
      plan: 'Riga SaaS Enterprise',
      status: 'active',
      price: '$49',
      seats: 5,
      storageGb: 50,
      sitesLimit: 20,
    });
  } catch (e) {
    console.warn('Workspace provisioning notice:', e);
  }

  return {
    ...insertedUser[0],
    organizationId: orgId,
    workspace: `${userName}'s Workspace`
  };
}

// Authenticate user with hashed password verification
export async function loginUser({ email, password }: { email: string; password?: string }) {
  if (!isDbConfigured) {
    throw new Error('Neon database is not configured. Please set DATABASE_URL environment variable.');
  }

  let foundUser: any = null;
  let storedHashedPassword: string | null = null;

  // 1. Look in Better Auth "user" table (single source of truth)
  const userList = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
  if (userList.length > 0) {
    foundUser = userList[0];
    const accList = await db.select().from(accountTable).where(eq(accountTable.userId, foundUser.id)).limit(1);
    if (accList.length > 0 && accList[0].password) {
      storedHashedPassword = accList[0].password;
    }
  }

  // 2. Seamlessly migrate legacy user if they exist in "users" but not in Better Auth yet
  if (!foundUser) {
    try {
      const legacyList = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (legacyList.length > 0) {
        const legacy = legacyList[0];
        const baUserId = legacy.uid || ('usr_' + Date.now());
        const plainPassword = password || 'Secret123!';
        const newHash = await hashPassword(plainPassword);

        // Migrate into Better Auth user table
        const migrated = await db.insert(userTable).values({
          id: baUserId,
          name: legacy.name || email.split('@')[0],
          email: legacy.email,
          emailVerified: true,
          role: legacy.role || 'Owner',
          plan: legacy.plan || 'WordPress Pro SaaS',
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        // Migrate into Better Auth account table with hashed password
        await db.insert(accountTable).values({
          id: 'acc_' + Date.now(),
          accountId: email,
          providerId: 'credential',
          userId: baUserId,
          password: newHash,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Auto provision organization and workspace
        const orgId = 'org_' + Date.now();
        const orgSlug = `${(legacy.name || 'owner').toLowerCase().replace(/[^a-z0-9]/g, '-')}-workspace`;
        try {
          await db.insert(orgTable).values({
            id: orgId,
            name: `${legacy.name || 'Owner'}'s Workspace`,
            slug: orgSlug,
            createdAt: new Date(),
          });

          await db.insert(memberTable).values({
            id: 'mem_' + Date.now(),
            organizationId: orgId,
            userId: baUserId,
            role: 'owner',
            createdAt: new Date(),
          });
        } catch (e) {}

        foundUser = migrated[0];
        storedHashedPassword = newHash;
      }
    } catch (migErr) {
      console.warn('Legacy migration notice:', migErr);
    }
  }

  if (!foundUser) {
    throw new Error('Account not found in Neon DB. Please create an account first.');
  }

  // 3. Validate Password with bcrypt
  if (storedHashedPassword && password) {
    const isMatch = await verifyPassword(password, storedHashedPassword);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }
  }

  // 3. Find active organization
  let orgData: any = null;
  try {
    const mems = await db.select().from(memberTable).where(eq(memberTable.userId, foundUser.id)).limit(1);
    if (mems.length > 0) {
      const orgs = await db.select().from(orgTable).where(eq(orgTable.id, mems[0].organizationId)).limit(1);
      if (orgs.length > 0) {
        orgData = {
          id: orgs[0].id,
          name: orgs[0].name,
          slug: orgs[0].slug,
          role: mems[0].role
        };
      }
    }
  } catch (e) {}

  return {
    ...foundUser,
    organization: orgData
  };
}

// Better Auth Organizations & Workspaces
export async function listUserOrganizations(userId: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    return [
      {
        id: 'org_local',
        name: `${local.user?.name || 'Owner'}'s Workspace`,
        slug: 'main-workspace',
        role: 'owner'
      }
    ];
  }

  try {
    const memberships = await db.select().from(memberTable).where(eq(memberTable.userId, userId));
    const orgs = [];
    for (const mem of memberships) {
      const oRes = await db.select().from(orgTable).where(eq(orgTable.id, mem.organizationId)).limit(1);
      if (oRes.length > 0) {
        orgs.push({
          id: oRes[0].id,
          name: oRes[0].name,
          slug: oRes[0].slug,
          role: mem.role,
          createdAt: oRes[0].createdAt
        });
      }
    }
    return orgs;
  } catch (err) {
    console.warn('Error listing organizations:', err);
    return [];
  }
}

export async function createUserOrganization(data: { name: string; userId: string }) {
  const orgId = 'org_' + Date.now();
  const slug = (data.name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

  if (!isDbConfigured) {
    return { id: orgId, name: data.name, slug, role: 'owner' };
  }

  try {
    await db.insert(orgTable).values({
      id: orgId,
      name: data.name,
      slug,
      createdAt: new Date(),
    });

    await db.insert(memberTable).values({
      id: 'mem_' + Date.now(),
      organizationId: orgId,
      userId: data.userId || 'usr_owner',
      role: 'owner',
      createdAt: new Date(),
    });

    return { id: orgId, name: data.name, slug, role: 'owner' };
  } catch (err) {
    console.warn('Error creating organization:', err);
    throw err;
  }
}

// Upsert Site with FULL JSON AST and responsive HTML compilation
export async function upsertSite(siteData: {
  id?: string;
  name: string;
  theme?: string;
  subdomain?: string;
  htmlContent?: string;
  jsonData?: any;
  status?: string;
  userId?: string;
  organizationId?: string;
  bundleSize?: string;
  versionHash?: string;
}) {
  const theme = siteData.theme || 'standard/Y1_a_1_Column_Layout';
  const name = siteData.name || 'New Website';

  // Guarantee rich default HTML and JSON AST if empty
  const htmlContent = siteData.htmlContent || getDefaultSiteHtml(name, theme);
  const jsonContent = siteData.jsonData 
    ? (typeof siteData.jsonData === 'string' ? siteData.jsonData : JSON.stringify(siteData.jsonData))
    : JSON.stringify(getDefaultSiteJson(name, theme));

  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    if (siteData.id) {
      local.sites = (local.sites || []).map((s: any) => s.id === siteData.id ? {
        ...s,
        ...siteData,
        htmlContent,
        jsonData: jsonContent,
        updated: new Date().toISOString().split('T')[0]
      } : s);
    } else {
      const id = 'site_' + Date.now();
      const subdomain = siteData.subdomain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.riga.site`;
      const newSite = {
        id,
        name,
        subdomain,
        theme,
        htmlContent,
        jsonData: jsonContent,
        status: siteData.status || 'published',
        visitors: '0',
        bundleSize: siteData.bundleSize || '42 KB',
        versionHash: siteData.versionHash || 'v1.0.0',
        updated: new Date().toISOString().split('T')[0]
      };
      local.sites = [...(local.sites || []), newSite];
    }
    saveLocalSaasDb(local);
    return;
  }

  try {
    const userId = siteData.userId || 'usr_owner';
    const orgId = siteData.organizationId || null;

    if (siteData.id) {
      await db.update(sites).set({
        name,
        theme,
        htmlContent,
        jsonData: jsonContent,
        status: siteData.status || 'published',
        ...(siteData.bundleSize ? { bundleSize: siteData.bundleSize } : {}),
        ...(siteData.versionHash ? { versionHash: siteData.versionHash } : {}),
        updatedAt: new Date(),
      }).where(eq(sites.id, siteData.id));
    } else {
      const id = 'site_' + Date.now();
      const subdomain = siteData.subdomain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random() * 1000)}.riga.site`;
      
      await db.insert(sites).values({
        id,
        userId,
        organizationId: orgId,
        name,
        subdomain,
        theme,
        htmlContent,
        jsonData: jsonContent,
        status: siteData.status || 'published',
        visitors: '0',
        bundleSize: siteData.bundleSize || '42 KB',
        versionHash: siteData.versionHash || 'v1.0.0',
      });

      await db.insert(domains).values({
        id: 'd_' + Date.now(),
        userId,
        organizationId: orgId,
        site: name,
        domain: subdomain,
        type: 'Subdomain',
        ssl: 'Active',
      });
    }
  } catch (error) {
    console.warn('Database query failed in upsertSite:', error);
  }
}

export async function deleteSite(siteId: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.sites = (local.sites || []).filter((s: any) => s.id !== siteId);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(sites).where(eq(sites.id, siteId));
  } catch (error) {
    console.warn('Database query failed in deleteSite:', error);
  }
}

export async function insertTeamMember(data: { name: string; email: string; role?: string; ownerId?: string; organizationId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = [...(local.team || []), {
      id: 't_' + Date.now(),
      name: data.name || 'Team Member',
      email: data.email || 'member@riga.site',
      role: data.role || 'Editor',
      status: 'Active'
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 't_' + Date.now();
    await db.insert(team).values({
      id,
      ownerId: data.ownerId || 'usr_owner',
      organizationId: data.organizationId,
      name: data.name || 'Team Member',
      email: data.email || 'member@riga.site',
      role: data.role || 'Editor',
      status: 'Active',
    });
  } catch (error) {
    console.warn('Database query failed in insertTeamMember:', error);
  }
}

export async function deleteTeamMember(id: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = (local.team || []).filter((t: any) => t.id !== id);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(team).where(eq(team.id, id));
  } catch (error) {
    console.warn('Database query failed in deleteTeamMember:', error);
  }
}

export async function insertDomain(data: { site: string; domain: string; type?: string; userId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.domains = [...(local.domains || []), {
      id: 'd_' + Date.now(),
      site: data.site,
      domain: data.domain,
      type: data.type || 'Custom Domain',
      ssl: 'Active'
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 'd_' + Date.now();
    await db.insert(domains).values({
      id,
      userId: data.userId || 'usr_owner',
      site: data.site,
      domain: data.domain,
      type: data.type || 'Custom Domain',
      ssl: 'Active',
    });
  } catch (error) {
    console.warn('Database query failed in insertDomain:', error);
  }
}

export async function insertMedia(data: { title: string; url: string; type?: string; size?: string; dimensions?: string; category?: string; userId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.media = [...(local.media || []), {
      id: 'm_' + Date.now(),
      title: data.title,
      url: data.url,
      type: data.type || 'image/jpeg',
      size: data.size || '240 KB',
      dimensions: data.dimensions || '1200 x 800',
      category: data.category || 'General',
      uploadedAt: new Date().toISOString().split('T')[0]
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 'm_' + Date.now();
    await db.insert(media).values({
      id,
      userId: data.userId || 'usr_owner',
      title: data.title,
      url: data.url,
      type: data.type || 'image/jpeg',
      size: data.size || '240 KB',
      dimensions: data.dimensions || '1200 x 800',
      category: data.category || 'General',
    });
  } catch (error) {
    console.warn('Database query failed in insertMedia:', error);
  }
}

export async function insertLead(data: { site: string; formName?: string; name: string; email: string; message: string; userId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.leads = [...(local.leads || []), {
      id: 'l_' + Date.now(),
      site: data.site,
      formName: data.formName || 'Contact Form',
      name: data.name,
      email: data.email,
      message: data.message,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'New'
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 'l_' + Date.now();
    await db.insert(leads).values({
      id,
      userId: data.userId || 'usr_owner',
      site: data.site,
      formName: data.formName || 'Contact Form',
      name: data.name,
      email: data.email,
      message: data.message,
      status: 'New',
    });
  } catch (error) {
    console.warn('Database query failed in insertLead:', error);
  }
}

export async function updateLeadStatus(id: string, status: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.leads = (local.leads || []).map((l: any) => l.id === id ? { ...l, status } : l);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id));
  } catch (error) {
    console.warn('Database query failed in updateLeadStatus:', error);
  }
}

export async function deleteMedia(id: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.media = (local.media || []).filter((m: any) => m.id !== id);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(media).where(eq(media.id, id));
  } catch (error) {
    console.warn('Database query failed in deleteMedia:', error);
  }
}

export async function updateTeamMember(id: string, updates: { role?: string; status?: string; name?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = (local.team || []).map((t: any) => t.id === id ? { ...t, ...updates } : t);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.update(team).set(updates).where(eq(team.id, id));
  } catch (error) {
    console.warn('Database query failed in updateTeamMember:', error);
  }
}
