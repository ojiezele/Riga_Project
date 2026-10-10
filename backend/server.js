import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Site from './models/Site.js';
import Team from './models/Team.js';
import { protect } from './middleware/authMiddleware.js';
import { authorize } from './middleware/rbacMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riga_saas';
mongoose.connect(MONGO_URI)
    .then(() => console.log('📦 MongoDB Connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Generate JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'riga_saas_secret_key_99', { expiresIn: '30d' });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role: 'Owner' });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SITES & HOSTING ROUTES ---
app.get('/api/sites', protect, async (req, res) => {
    try {
        const sites = await Site.find({ userId: req.user._id });
        res.json(sites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/sites', protect, async (req, res) => {
    try {
        const { name, theme, htmlContent, jsonData } = req.body;
        const subdomain = (name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000) + '.riga.site';
        
        const site = await Site.create({
            userId: req.user._id,
            name,
            subdomain,
            theme: theme || 'standard/Y1_a_1_Column_Layout',
            htmlContent: htmlContent || '',
            jsonData: jsonData || {},
            status: 'published',
            visitors: 0
        });
        res.status(201).json(site);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/sites/:id', protect, authorize('Owner', 'Administrator', 'Editor'), async (req, res) => {
    try {
        const site = await Site.findById(req.params.id);
        if (!site) return res.status(404).json({ message: 'Site not found' });
        
        await site.deleteOne();
        res.json({ message: 'Site removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- TEAM & RBAC ROUTES ---
app.get('/api/team', protect, async (req, res) => {
    try {
        const team = await Team.find({ ownerId: req.user._id });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/team', protect, authorize('Owner', 'Administrator'), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const member = await Team.create({
            ownerId: req.user._id,
            name,
            email,
            role: role || 'Editor',
            status: 'Pending'
        });
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/team/:id', protect, authorize('Owner', 'Administrator'), async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        await member.deleteOne();
        res.json({ message: 'Team member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MERN SaaS Backend Server running on port ${PORT}`));
