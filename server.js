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
app.use(express.static(path.join(__dirname)));

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
    active: { type: Boolean, default: true }
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// --- Initialization: Seed Menu Items if empty ---
const initialMenu = [
    { id: 1, name: "Tea", price: 40, category: "Popular", bestseller: true, image: "./assets/images/tea-order-photo_7.jpg", active: true },
    { id: 2, name: "Masala Tea", price: 40, category: "Popular", bestseller: true, image: "./assets/images/tea-order-photo_1.jpg", active: true },
    { id: 3, name: "Ginger Tea", price: 45, category: "Popular", bestseller: true, image: "./assets/images/tea-order-photo_2.jpg", active: true },
    { id: 4, name: "Green Tea", price: 50, category: "Healthy", bestseller: false, image: "./assets/images/tea-order-photo_3.jpg", active: true },
    { id: 5, name: "Irani Chai", price: 120, category: "Milk Special", bestseller: true, image: "./assets/images/tea-order-photo_4.jpg", active: true },
    { id: 6, name: "Kashmiri Kahwa", price: 90, category: "Premium", bestseller: false, image: "./assets/images/tea-order-photo_5.jpg", active: true },
    { id: 7, name: "Lemon Iced Tea", price: 70, category: "Cold", bestseller: false, image: "./assets/images/tea-order-photo_6.jpg", active: true },
    { id: 8, name: "chamomile Tea", price: 50, category: "Healthy", bestseller: false, image: "./assets/images/tea-order-photo_8.jpg", active: true },
    { id: 9, name: "Black Tea", price: 50, category: "Healthy", bestseller: false, image: "./assets/images/tea-order-photo_9.jpg", active: true },
    { id: 10, name: "Tea with Biscuits", price: 80, category: "Snacks", bestseller: false, image: "./assets/images/tea-order-photo_10.jpg", active: true },
    { id: 11, name: "Onion Samosa (2 pcs)", price: 30, category: "Snacks", bestseller: true, image: "https://placehold.co/400x300?text=Onion+Samosa", active: true },
    { id: 12, name: "Egg Puff", price: 35, category: "Snacks", bestseller: false, image: "https://placehold.co/400x300?text=Egg+Puff", active: true },
    { id: 13, name: "Bun Butter Jam", price: 25, category: "Snacks", bestseller: true, image: "https://placehold.co/400x300?text=Bun+Butter+Jam", active: true },
    { id: 14, name: "Masala Vada (2 pcs)", price: 30, category: "Snacks", bestseller: false, image: "https://placehold.co/400x300?text=Masala+Vada", active: true },
    { id: 15, name: "Bread Omelette", price: 50, category: "Snacks", bestseller: false, image: "https://placehold.co/400x300?text=Bread+Omelette", active: true },
    { id: 16, name: "Veg Fried Rice", price: 90, category: "Fast Food", bestseller: true, image: "https://placehold.co/400x300?text=Fried+Rice", active: true },
    { id: 17, name: "Chicken Noodles", price: 110, category: "Fast Food", bestseller: true, image: "https://placehold.co/400x300?text=Chicken+Noodles", active: true },
    { id: 18, name: "Gobi Manchurian", price: 80, category: "Fast Food", bestseller: false, image: "https://placehold.co/400x300?text=Gobi+Manchurian", active: true },
    { id: 19, name: "Idli (2 pcs)", price: 20, category: "Breakfast", bestseller: true, image: "https://placehold.co/400x300?text=Idli", active: true },
    { id: 20, name: "Ghee Pongal", price: 40, category: "Breakfast", bestseller: true, image: "https://placehold.co/400x300?text=Pongal", active: true },
    { id: 21, name: "Masala Dosa", price: 50, category: "Breakfast", bestseller: false, image: "https://placehold.co/400x300?text=Masala+Dosa", active: true },
    { id: 22, name: "Vada (1 pc)", price: 10, category: "Breakfast", bestseller: false, image: "https://placehold.co/400x300?text=Vada", active: true }
];

async function seedMenu() {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
        await MenuItem.insertMany(initialMenu);
        console.log("Menu Seeded to MongoDB");
    }
}
seedMenu();

// --- API Routes ---

// 1. Get all tea shops (Hardcoded for Demo)
app.get('/api/shops', (req, res) => {
    const shops = [
        { id: 1, name: "Royal Tea", location: "Erode", image: "assets/images/tea-1.jpg", rating: 4.5 },
        { id: 2, name: "Chai Kings", location: "Anthiyur", image: "assets/images/tea-2.jpg", rating: 4.2 },
        { id: 3, name: "Green Leaf Tea", location: "Coimbatore", image: "assets/images/tea-3.jpg", rating: 4.8 },
        { id: 4, name: "Chennai Chai", location: "Chennai", image: "assets/images/tea-1.jpg", rating: 4.0 },
        { id: 5, name: "Salem Sips", location: "Salem", image: "assets/images/tea-2.jpg", rating: 4.3 }
    ];
    res.json(shops);
});

// 2. Search Tea Shops
app.get('/api/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const shops = [
        { id: 1, name: "Royal Tea", location: "Erode", image: "assets/images/tea-1.jpg", rating: 4.5 },
        { id: 2, name: "Chai Kings", location: "Anthiyur", image: "assets/images/tea-2.jpg", rating: 4.2 },
        { id: 3, name: "Green Leaf Tea", location: "Coimbatore", image: "assets/images/tea-3.jpg", rating: 4.8 },
        { id: 4, name: "Chennai Chai", location: "Chennai", image: "assets/images/tea-1.jpg", rating: 4.0 },
        { id: 5, name: "Salem Sips", location: "Salem", image: "assets/images/tea-2.jpg", rating: 4.3 }
    ];
    const results = shops.filter(shop =>
        shop.location.toLowerCase().includes(query) || shop.name.toLowerCase().includes(query)
    );
    res.json(results);
});

// 3. Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email }, { username: email }], password });
        if (user) {
            res.json({ success: true, user: { username: user.username, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    } catch (err) { res.status(500).json({ success: false }); }
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

        const partnerOrders = await Order.find({ city: partner.city });
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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
