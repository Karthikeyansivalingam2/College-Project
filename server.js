require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── No-Cache Headers for HTML / CSS / JS ───────────────────────────────────
// Always serve fresh code — no stale page issues
app.use((req, res, next) => {
    const ext = path.extname(req.path);
    if (['.html', '.css', '.js'].includes(ext) || req.path === '/' || !ext) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) {
        // Images: Cache for 7 days
        res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    next();
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- Database Schemas ---

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
    orderId: String,
    name: String,
    username: String,
    mobile: String,
    address: String,
    city: String,
    items: Object,
    total: String,
    status: { type: String, default: 'Pending' },
    paymentMethod: String,
    paymentStatus: String,
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const PartnerSchema = new mongoose.Schema({
    partnerId: { type: String, unique: true },
    businessName: String,
    mobile: String,
    city: String,
    password: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
});
const Partner = mongoose.model('Partner', PartnerSchema);

const EnquirySchema = new mongoose.Schema({
    enquiryId: String,
    name: String,
    email: String,
    mobile: String,
    company: String,
    package: String,
    guests: Number,
    date: { type: Date, default: Date.now }
});
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

const JobApplicationSchema = new mongoose.Schema({
    appId: String,
    name: String,
    email: String,
    mobile: String,
    role: String,
    experience: String,
    status: { type: String, default: 'New' },
    date: { type: Date, default: Date.now }
});
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

const MenuItemSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    price: Number,
    category: String,
    bestseller: Boolean,
    image: String,
    active: { type: Boolean, default: true },
    calories: Number
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// ============================================================
//   REAL POPULAR MENU — Inspired by Zomato & Swiggy TN
// ============================================================
const realMenu = [

    // ── BEVERAGES / POPULAR ──────────────────────────────────
    { id: 1, name: "Filter Coffee", price: 45, category: "Popular", bestseller: true, calories: 120, image: "image/filter-coffee.png" },
    { id: 2, name: "Masala Chai", price: 35, category: "Popular", bestseller: true, calories: 110, image: "https://images.unsplash.com/photo-1517673132405-a56a62b189ee?q=80&w=400" },
    { id: 3, name: "Lemon Tea", price: 30, category: "Popular", bestseller: false, calories: 60, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400" },
    { id: 4, name: "Cold Coffee", price: 80, category: "Popular", bestseller: true, calories: 200, image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?q=80&w=400" },
    { id: 5, name: "Mango Lassi", price: 90, category: "Popular", bestseller: true, calories: 280, image: "https://images.unsplash.com/photo-1571091718767-18b5c1457add?q=80&w=400" },
    { id: 6, name: "Badam Milk", price: 70, category: "Popular", bestseller: false, calories: 240, image: "https://images.unsplash.com/photo-1550583726-2a7e716ed5d2?q=80&w=400" },
    { id: 7, name: "Tender Coconut Juice", price: 60, category: "Popular", bestseller: false, calories: 90, image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?q=80&w=400" },
    { id: 8, name: "Nannari Sherbet", price: 50, category: "Popular", bestseller: false, calories: 80, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400" },
    { id: 9, name: "Rose Milk", price: 55, category: "Popular", bestseller: false, calories: 180, image: "https://images.unsplash.com/photo-1550583726-2a7e716ed5d2?q=80&w=400" },
    { id: 10, name: "Watermelon Juice", price: 65, category: "Popular", bestseller: false, calories: 70, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=400" },

    // ── BREAKFAST ────────────────────────────────────────────
    { id: 11, name: "Idli Sambar", price: 60, category: "Breakfast", bestseller: true, calories: 150, image: "https://images.unsplash.com/photo-1610088816440-4e6e09f30286?q=80&w=400" },
    { id: 12, name: "Masala Dosa", price: 85, category: "Breakfast", bestseller: true, calories: 350, image: "https://images.unsplash.com/photo-1587244304049-81ecdedfe74c?q=80&w=400" },
    { id: 13, name: "Plain Dosa", price: 65, category: "Breakfast", bestseller: false, calories: 280, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=400" },
    { id: 14, name: "Onion Rava Dosa", price: 90, category: "Breakfast", bestseller: true, calories: 320, image: "https://images.unsplash.com/photo-1599487488170-d11ec93a730b?q=80&w=400" },
    { id: 15, name: "Pongal with Sambar", price: 70, category: "Breakfast", bestseller: true, calories: 380, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400" },
    { id: 16, name: "Upma", price: 55, category: "Breakfast", bestseller: false, calories: 250, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400" },
    { id: 17, name: "Poori Masala", price: 75, category: "Breakfast", bestseller: true, calories: 450, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=400" },
    { id: 18, name: "Vada with Chutney", price: 60, category: "Breakfast", bestseller: true, calories: 200, image: "https://images.unsplash.com/photo-1606491048802-8342506d6471?q=80&w=400" },
    { id: 19, name: "Pesarattu", price: 70, category: "Breakfast", bestseller: false, calories: 220, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400" },
    { id: 20, name: "Appam with Stew", price: 95, category: "Breakfast", bestseller: false, calories: 290, image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=400" },
    { id: 21, name: "Puttu Kadala Curry", price: 90, category: "Breakfast", bestseller: false, calories: 400, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400" },
    { id: 22, name: "Bread Omelette", price: 80, category: "Breakfast", bestseller: true, calories: 350, image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=400" },
    { id: 23, name: "Paniyaram", price: 65, category: "Breakfast", bestseller: false, calories: 180, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400" },

    // ── LUNCH ────────────────────────────────────────────────
    { id: 24, name: "Chicken Biryani", price: 220, category: "Lunch", bestseller: true, calories: 750, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400" },
    { id: 25, name: "Mutton Biryani", price: 280, category: "Lunch", bestseller: true, calories: 820, image: "https://images.unsplash.com/photo-1589187151032-aa00ad04100c?q=80&w=400" },
    { id: 26, name: "Veg Biryani", price: 160, category: "Lunch", bestseller: true, calories: 620, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=400" },
    { id: 27, name: "Egg Biryani", price: 180, category: "Lunch", bestseller: true, calories: 680, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400" },
    { id: 28, name: "Full Meals (Veg)", price: 160, category: "Lunch", bestseller: true, calories: 900, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400" },
    { id: 29, name: "Full Meals (Non-Veg)", price: 200, category: "Lunch", bestseller: true, calories: 980, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400" },
    { id: 30, name: "Chettinad Chicken Curry", price: 200, category: "Lunch", bestseller: true, calories: 520, image: "https://images.unsplash.com/photo-1567306301498-519dde9cead7?q=80&w=400" },
    { id: 31, name: "Fish Curry Rice", price: 190, category: "Lunch", bestseller: true, calories: 580, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=400" },
    { id: 32, name: "Sambar Rice", price: 80, category: "Lunch", bestseller: false, calories: 380, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400" },
    { id: 33, name: "Tamarind Rice (Puliyogare)", price: 90, category: "Lunch", bestseller: false, calories: 360, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400" },
    { id: 34, name: "Lemon Rice", price: 85, category: "Lunch", bestseller: false, calories: 350, image: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?q=80&w=400" },
    { id: 35, name: "Chicken 65 Rice Combo", price: 210, category: "Lunch", bestseller: true, calories: 720, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400" },
    { id: 36, name: "Prawn Masala Rice", price: 250, category: "Lunch", bestseller: false, calories: 640, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400" },
    { id: 37, name: "Kadai Paneer with Roti", price: 180, category: "Lunch", bestseller: true, calories: 560, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400" },
    { id: 38, name: "Dal Makhani with Naan", price: 170, category: "Lunch", bestseller: true, calories: 620, image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=400" },

    // ── DINNER ───────────────────────────────────────────────
    { id: 39, name: "Chicken Parotta", price: 140, category: "Dinner", bestseller: true, calories: 620, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400" },
    { id: 40, name: "Mutton Kheema Parotta", price: 180, category: "Dinner", bestseller: true, calories: 700, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400" },
    { id: 41, name: "Butter Chicken with Naan", price: 220, category: "Dinner", bestseller: true, calories: 680, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400" },
    { id: 42, name: "Palak Paneer with Roti", price: 170, category: "Dinner", bestseller: false, calories: 480, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400" },
    { id: 43, name: "Kothu Parotta", price: 130, category: "Dinner", bestseller: true, calories: 520, image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=400" },
    { id: 44, name: "Egg Kothu Parotta", price: 150, category: "Dinner", bestseller: true, calories: 590, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400" },
    { id: 45, name: "Chicken Tikka Masala", price: 210, category: "Dinner", bestseller: true, calories: 580, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=400" },
    { id: 46, name: "Mushroom Pepper Fry", price: 160, category: "Dinner", bestseller: false, calories: 320, image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=400" },
    { id: 47, name: "Prawn Pepper Fry", price: 240, category: "Dinner", bestseller: false, calories: 420, image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=400" },
    { id: 48, name: "Fish Fry Dinner", price: 200, category: "Dinner", bestseller: true, calories: 460, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=400" },
    { id: 49, name: "Egg Curry with Chapati", price: 120, category: "Dinner", bestseller: false, calories: 480, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400" },
    { id: 50, name: "Veg Kurma with Parotta", price: 130, category: "Dinner", bestseller: false, calories: 550, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400" },

    // ── FAST FOOD & SNACKS ───────────────────────────────────
    { id: 51, name: "Chicken Burger", price: 130, category: "Fast Food", bestseller: true, calories: 520, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400" },
    { id: 52, name: "Zinger Burger", price: 150, category: "Fast Food", bestseller: true, calories: 580, image: "https://images.unsplash.com/photo-1571091718767-18b5c1457add?q=80&w=400" },
    { id: 53, name: "Veg Burger", price: 100, category: "Fast Food", bestseller: false, calories: 420, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400" },
    { id: 54, name: "French Fries", price: 90, category: "Fast Food", bestseller: true, calories: 380, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400" },
    { id: 55, name: "Peri Peri Fries", price: 110, category: "Fast Food", bestseller: true, calories: 420, image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=400" },
    { id: 56, name: "Chicken 65", price: 160, category: "Fast Food", bestseller: true, calories: 480, image: "https://images.unsplash.com/photo-1601050690597-df056fb1b7ea?q=80&w=400" },
    { id: 57, name: "Gobi Manchurian", price: 130, category: "Fast Food", bestseller: true, calories: 380, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=400" },
    { id: 58, name: "Chicken Shawarma", price: 120, category: "Fast Food", bestseller: true, calories: 500, image: "https://images.unsplash.com/photo-1561461056-b5f86b4dd53c?q=80&w=400" },
    { id: 59, name: "Veg Shawarma", price: 90, category: "Fast Food", bestseller: false, calories: 380, image: "https://images.unsplash.com/photo-1599487488170-d11ec93a730b?q=80&w=400" },
    { id: 60, name: "Chicken Nuggets", price: 140, category: "Fast Food", bestseller: true, calories: 460, image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400" },
    { id: 61, name: "Veg Spring Roll", price: 100, category: "Fast Food", bestseller: false, calories: 280, image: "https://images.unsplash.com/photo-1582196016295-f8c499d33d1a?q=80&w=400" },
    { id: 62, name: "Paneer Tikka", price: 180, category: "Fast Food", bestseller: true, calories: 420, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400" },
    { id: 63, name: "Egg Puff", price: 30, category: "Fast Food", bestseller: true, calories: 200, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400" },
    { id: 64, name: "Veg Puff", price: 25, category: "Fast Food", bestseller: true, calories: 180, image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=400" },
    { id: 65, name: "Mumbai Pav Bhaji", price: 120, category: "Fast Food", bestseller: true, calories: 500, image: "https://images.unsplash.com/photo-1606491048802-8342506d6471?q=80&w=400" },
    { id: 66, name: "Hakka Noodles", price: 130, category: "Fast Food", bestseller: true, calories: 450, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=400" },
    { id: 67, name: "Chicken Fried Rice", price: 160, category: "Fast Food", bestseller: true, calories: 550, image: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?q=80&w=400" },
    { id: 68, name: "Veg Fried Rice", price: 130, category: "Fast Food", bestseller: false, calories: 450, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400" },
    { id: 69, name: "Cheese Pizza (7 inch)", price: 180, category: "Fast Food", bestseller: true, calories: 680, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400" },
    { id: 70, name: "Chicken Pizza (7 inch)", price: 220, category: "Fast Food", bestseller: true, calories: 720, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400" },
    { id: 71, name: "Samosa (2 pcs)", price: 40, category: "Fast Food", bestseller: true, calories: 220, image: "https://images.unsplash.com/photo-1601050690597-df056fb1b7ea?q=80&w=400" },
    { id: 72, name: "Aloo Tikki Chaat", price: 80, category: "Fast Food", bestseller: false, calories: 290, image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=400" },

    // ── HEALTHY / DIET ───────────────────────────────────────
    { id: 73, name: "Greek Salad", price: 180, category: "Healthy", bestseller: false, calories: 200, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400" },
    { id: 74, name: "Grilled Chicken Bowl", price: 220, category: "Healthy", bestseller: true, calories: 350, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400" },
    { id: 75, name: "Quinoa Salad", price: 200, category: "Healthy", bestseller: false, calories: 280, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400" },
    { id: 76, name: "Oats Porridge", price: 90, category: "Healthy", bestseller: false, calories: 180, image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400" },
    { id: 77, name: "Sprouts Salad", price: 120, category: "Healthy", bestseller: false, calories: 160, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400" },
    { id: 78, name: "Millet Khichdi", price: 130, category: "Healthy", bestseller: false, calories: 290, image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400" },
    { id: 79, name: "Ragi Mudde", price: 100, category: "Healthy", bestseller: false, calories: 240, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400" },
    { id: 80, name: "Fruit Bowl", price: 120, category: "Healthy", bestseller: false, calories: 150, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400" },
    { id: 81, name: "Paneer Salad", price: 160, category: "Healthy", bestseller: false, calories: 260, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400" },
    { id: 82, name: "Steamed Momos", price: 100, category: "Healthy", bestseller: true, calories: 220, image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=400" },
];

async function seedMenu() {
    try {
        const operations = realMenu.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: { $set: { ...item, active: true, prep_time: `${10 + Math.floor(Math.random() * 20)} mins`, rating: (3.8 + Math.random() * 1.2).toFixed(1) } },
                upsert: true
            }
        }));
        await MenuItem.bulkWrite(operations);
        // Remove any old items not in realMenu
        const validIds = realMenu.map(i => i.id);
        await MenuItem.deleteMany({ id: { $nin: validIds } });
        console.log(`✅ ${realMenu.length} Real Zomato/Swiggy Menu Items Synced!`);
    } catch (err) {
        console.error("Menu Seed Error:", err);
    }
}
seedMenu();


// Graceful error handling for server
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// --- API Routes ---

// 1. Get all restaurants (Hardcoded for Demo)
app.get('/api/shops', (req, res) => {
    const shops = [
        { id: 1, name: "Spice Garden", location: "Erode", image: "assets/images/tea-1.jpg", rating: 4.5 },
        { id: 2, name: "Anjappar", location: "Chennai", image: "assets/images/tea-2.jpg", rating: 4.2 },
        { id: 3, name: "Green Leaf", location: "Coimbatore", image: "assets/images/tea-3.jpg", rating: 4.8 },
        { id: 4, name: "Taste of Chennai", location: "Chennai", image: "assets/images/tea-1.jpg", rating: 4.0 },
        { id: 5, name: "Salem Grand", location: "Salem", image: "assets/images/tea-2.jpg", rating: 4.3 }
    ];
    res.json(shops);
});

// 2. Search Restaurants
app.get('/api/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const shops = [
        { id: 1, name: "Spice Garden", location: "Erode", image: "assets/images/tea-1.jpg", rating: 4.5 },
        { id: 2, name: "Anjappar", location: "Chennai", image: "assets/images/tea-2.jpg", rating: 4.2 },
        { id: 3, name: "Green Leaf", location: "Coimbatore", image: "assets/images/tea-3.jpg", rating: 4.8 },
        { id: 4, name: "Taste of Chennai", location: "Chennai", image: "assets/images/tea-1.jpg", rating: 4.0 },
        { id: 5, name: "Salem Grand", location: "Salem", image: "assets/images/tea-2.jpg", rating: 4.3 }
    ];
    const results = shops.filter(shop =>
        shop.location.toLowerCase().includes(query) || shop.name.toLowerCase().includes(query)
    );
    res.json(results);
});

// 3. Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const trimmedEmail = (email || '').trim();
    const trimmedPassword = (password || '').trim();
    try {
        // Case-insensitive username/email match
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') } },
                { username: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') } }
            ],
            password: trimmedPassword
        });
        if (user) {
            res.json({ success: true, user: { username: user.username, email: user.email } });
        } else {
            // Return 200 so frontend can read the JSON error properly
            res.json({ success: false, message: "Invalid username or password." });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.json({ success: false, message: "Server error. Please try again." });
    }
});

// 4. Signup
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) return res.status(400).json({ success: false, message: "User already exists!" });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ success: true, message: "Registration successful!" });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 5. Order
app.post('/api/order', async (req, res) => {
    try {
        const orderData = req.body;
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const newOrder = new Order({ ...orderData, orderId });
        await newOrder.save();
        res.json({ success: true, message: "Order placed!", orderId });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 6. Enquiry
app.post('/api/enquire', async (req, res) => {
    try {
        const enquiryId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
        const newEnquiry = new Enquiry({ ...req.body, enquiryId });
        await newEnquiry.save();
        res.json({ success: true, enquiryId });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 7. Job Application
app.post('/api/apply/job', async (req, res) => {
    try {
        const appId = 'JOB-' + Math.floor(1000 + Math.random() * 9000);
        const newApp = new JobApplication({ ...req.body, appId });
        await newApp.save();
        res.json({ success: true, appId });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 8. Partner Application
app.post('/api/apply/partner', async (req, res) => {
    try {
        const partnerId = 'PTR-' + Math.floor(1000 + Math.random() * 9000);
        const password = req.body.password || "partner123";
        const newPartner = new Partner({ ...req.body, partnerId, password });
        await newPartner.save();
        res.json({ success: true, partnerId });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 9. Partner Login
app.post('/api/partner/login', async (req, res) => {
    try {
        const { partnerId, password } = req.body;
        const partner = await Partner.findOne({ partnerId, password });
        if (partner) {
            if (partner.status !== 'Active') return res.status(403).json({ success: false, message: "Account pending approval." });
            res.json({ success: true, partner: { partnerId: partner.partnerId, businessName: partner.businessName } });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

// 10. Partner Dashboard
app.get('/api/partner/dashboard/:id', async (req, res) => {
    try {
        const partner = await Partner.findOne({ partnerId: req.params.id });
        if (!partner) return res.status(404).json({ message: "Not found" });

        // DEBUG: SHOW ALL ORDERS TEMPORARILY
        // To fix visibility issues
        const partnerOrders = await Order.find({});
        const totalEarnings = partnerOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
        const pendingCount = partnerOrders.filter(o => o.status === 'Pending').length;

        res.json({
            businessName: partner.businessName,
            partnerId: partner.partnerId,
            status: partner.status,
            stats: { todayOrders: partnerOrders.length, totalEarnings, pendingOrders: pendingCount, rating: "4.8" },
            recentOrders: partnerOrders.reverse().map(o => ({
                id: o.orderId, customer: o.name, itemsSummary: Object.keys(o.items || {}).join(', '), total: o.total, status: o.status, time: 'Recently'
            }))
        });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// 11. Admin Data
app.get('/api/admin/data', async (req, res) => {
    try {
        const orders = await Order.find();
        const enquiries = await Enquiry.find();
        const jobApplications = await JobApplication.find();
        const partners = await Partner.find();
        res.json({ orders, enquiries, jobApplications, partners });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 12. Update Status
app.post('/api/order/status', async (req, res) => {
    try {
        await Order.findOneAndUpdate({ orderId: req.body.orderId }, { status: req.body.status });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/partner/status', async (req, res) => {
    try {
        await Partner.findOneAndUpdate({ partnerId: req.body.partnerId }, { status: req.body.status });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/order/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (order) res.json(order); else res.status(404).json({ message: "Not found" });
    } catch (err) { res.status(500).send(); }
});

app.get('/api/user-orders', async (req, res) => {
    try {
        const userOrders = await Order.find({ username: req.query.username });
        res.json(userOrders);
    } catch (err) { res.json([]); }
});

// 13. Menu
app.get('/api/menu', async (req, res) => { res.json(await MenuItem.find()); });

app.post('/api/menu/update', async (req, res) => {
    try {
        await MenuItem.findOneAndUpdate({ id: req.body.id }, { price: req.body.price, active: req.body.active });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/menu/add', async (req, res) => {
    try {
        const lastItem = await MenuItem.findOne().sort({ id: -1 });
        const newId = lastItem ? lastItem.id + 1 : 1;
        const newItem = new MenuItem({ ...req.body, id: newId, active: true });
        await newItem.save();
        res.json({ success: true, item: newItem });
    } catch (err) { res.status(500).json({ success: false }); }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
