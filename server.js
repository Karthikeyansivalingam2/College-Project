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

const initialMenuBase = [
    { id: 1, name: "Normal Tea", price: 40, category: "Popular", image: "./assets/images/tea-order-photo_7.jpg", calories: 120 },
    { id: 2, name: "Filter Coffee", price: 45, category: "Popular", image: "https://images.unsplash.com/photo-1594910410712-402287968db8?q=80&w=400", calories: 180 },
    { id: 3, name: "Chicken Biryani", price: 220, category: "Lunch", image: "https://placehold.co/400x300?text=Chicken+Biryani", calories: 750 },
    { id: 4, name: "Veg Meals", price: 160, category: "Lunch", image: "https://placehold.co/400x300?text=Veg+Meals", calories: 850 },
    { id: 5, name: "Idli Sambar", price: 60, category: "Breakfast", image: "https://placehold.co/400x300?text=Idli", calories: 180 },
    { id: 6, name: "Masala Dosa", price: 85, category: "Breakfast", image: "https://placehold.co/400x300?text=Dosa", calories: 350 },
    { id: 7, name: "Chicken Parotta", price: 140, category: "Dinner", image: "https://placehold.co/400x300?text=Parotta", calories: 620 },
    { id: 8, name: "Greek Salad", price: 180, category: "Healthy", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400", calories: 220 },
    { id: 9, name: "Veg Burger", price: 110, category: "Fast Food", image: "https://placehold.co/400x300?text=Burger", calories: 480 },
    { id: 10, name: "French Fries", price: 90, category: "Fast Food", image: "https://placehold.co/400x300?text=Fries", calories: 410 }
];

const imagePool = {
    "Popular": [
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
        "https://images.unsplash.com/photo-1594910410712-402287968db8?q=80&w=400",
        "https://images.unsplash.com/photo-1517673132405-a56a62b189ee?q=80&w=400",
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400",
        "https://images.unsplash.com/photo-1599390805042-3c18e69817cf?q=80&w=400",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400",
        "https://images.unsplash.com/photo-1550583726-2a7e716ed5d2?q=80&w=400"
    ],
    "Lunch": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
        "https://images.unsplash.com/photo-1567306301498-519dde9cead7?q=80&w=400",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400",
        "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=400",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400",
        "https://images.unsplash.com/photo-1589187151032-aa00ad04100c?q=80&w=400"
    ],
    "Breakfast": [
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400",
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=400",
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400",
        "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=400",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400",
        "https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=400"
    ],
    "Dinner": [
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400",
        "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400",
        "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=400",
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=400",
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=400"
    ],
    "Healthy": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
        "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400",
        "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400",
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400"
    ],
    "Fast Food": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400",
        "https://images.unsplash.com/photo-1571091718767-18b5c1457add?q=80&w=400",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=400",
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400",
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=400",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400"
    ],
    "Snacks": [
        "https://images.unsplash.com/photo-1599487488170-d11ec93a730b?q=80&w=400",
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=400",
        "https://images.unsplash.com/photo-1601050690597-df056fb1b7ea?q=80&w=400",
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400",
        "https://images.unsplash.com/photo-1582196016295-f8c499d33d1a?q=80&w=400",
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400",
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=400"
    ]
};

function generateExpandedMenu(targetCount = 300) {
    const finalMenu = [];
    const prefixes = ["Classic", "Spicy", "Premium", "Special", "Home Style", "Chef's", "Royal", "Hyderabadi", "Chettinad", "Malabar"];
    const suffixes = ["Combo", "Delight", "Platter", "Bowl", "Box", "Blast", "Supreme", "Treat"];
    // const categories = ["Popular", "Lunch", "Breakfast", "Dinner", "Healthy", "Fast Food", "Snacks", "Milk Special", "Premium", "Cold"]; // Removed as no longer directly used

    // Seed with existing 120 items first (keeping manual ones) or just generate fresh
    // For simplicity and to ensure 300, let's generate variations
    for (let i = 1; i <= targetCount; i++) {
        const base = initialMenuBase[i % initialMenuBase.length];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        // Pick individual random image from pool based on category
        const pool = imagePool[base.category] || imagePool["Popular"]; // Fallback to Popular if category not found
        const randomImg = pool[Math.floor(Math.random() * pool.length)];

        finalMenu.push({
            id: i,
            name: `${prefix} ${base.name} ${suffix} ${i}`,
            price: base.price + (Math.floor(Math.random() * 10) * 10), // add random cost
            category: base.category,
            bestseller: Math.random() > 0.8,
            image: randomImg,
            active: true,
            calories: base.calories + Math.floor(Math.random() * 100)
        });
    }
    return finalMenu;
}

async function seedMenu() {
    try {
        const fullMenu = generateExpandedMenu(300);
        const operations = fullMenu.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: { $set: item },
                upsert: true
            }
        }));
        await MenuItem.bulkWrite(operations);
        console.log("300 Diverse Menu Items Synced with MongoDB");
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
