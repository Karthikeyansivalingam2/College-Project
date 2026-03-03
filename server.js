require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const MenuItem = require('./models/MenuItem');
const realMenu = require('./config/menuData');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── No-Cache Headers for HTML / CSS / JS ───────────────────────────────────
app.use((req, res, next) => {
    const ext = path.extname(req.path);
    if (['.html', '.css', '.js'].includes(ext) || req.path === '/' || !ext) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Menu Seeding Logic (Only for local development startup)
async function seedMenu() {
    try {
        await connectDB();
        const operations = realMenu.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: { $set: { ...item, active: true, prep_time: `${10 + Math.floor(Math.random() * 20)} mins`, rating: (3.8 + Math.random() * 1.2).toFixed(1) } },
                upsert: true
            }
        }));
        await MenuItem.bulkWrite(operations);
        const validIds = realMenu.map(i => i.id);
        await MenuItem.deleteMany({ id: { $nin: validIds } });
        console.log(`✅ ${realMenu.length} Menu Items Synced!`);
    } catch (err) {
        console.error("Menu Seed Error:", err.message);
    }
}

// Health check route (useful for debugging Vercel cold starts)
app.get('/api/health', async (req, res) => {
    try {
        await connectDB();
        res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
    }
});

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Start Server (local dev only — Vercel handles its own startup)
if (require.main === module) {
    connectDB().then(() => {
        seedMenu(); // Only seed on local startup
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    }).catch(err => {
        console.error('Failed to connect to DB on startup:', err.message);
        process.exit(1);
    });
}

module.exports = app;
