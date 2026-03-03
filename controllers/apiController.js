const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Order = require('../models/Order');
const Partner = require('../models/Partner');
const Enquiry = require('../models/Enquiry');
const JobApplication = require('../models/JobApplication');
const MenuItem = require('../models/MenuItem');

// 1. Get all restaurants (Hardcoded for Demo)
exports.getShops = (req, res) => {
    const shops = [
        { id: 1, name: "Spice Garden", location: "Erode", image: "assets/images/tea-1.jpg", rating: 4.5 },
        { id: 2, name: "Anjappar", location: "Chennai", image: "assets/images/tea-2.jpg", rating: 4.2 },
        { id: 3, name: "Green Leaf", location: "Coimbatore", image: "assets/images/tea-3.jpg", rating: 4.8 },
        { id: 4, name: "Taste of Chennai", location: "Chennai", image: "assets/images/tea-1.jpg", rating: 4.0 },
        { id: 5, name: "Salem Grand", location: "Salem", image: "assets/images/tea-2.jpg", rating: 4.3 }
    ];
    res.json(shops);
};

// 2. Search Restaurants
exports.searchShops = (req, res) => {
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
};

// 3. Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const trimmedEmail = (email || '').trim();
    const trimmedPassword = (password || '').trim();
    try {
        await connectDB();
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') } },
                { username: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') } }
            ]
        });

        if (user) {
            const isMatch = await bcrypt.compare(trimmedPassword, user.password);
            if (isMatch) {
                res.json({ success: true, user: { username: user.username, email: user.email } });
            } else {
                res.json({ success: false, message: "Invalid username or password." });
            }
        } else {
            res.json({ success: false, message: "Invalid username or password." });
        }
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

// 4. Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await connectDB();
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) return res.status(400).json({ success: false, message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.json({ success: true, message: "Registration successful!" });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ success: false, message: "Server error during registration. Please try again." });
    }
};

// 5. Order
exports.placeOrder = async (req, res) => {
    try {
        await connectDB();
        const orderData = req.body;
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const newOrder = new Order({ ...orderData, orderId });
        await newOrder.save();

        // Simulate sending email
        logOrderEmail(newOrder);

        res.json({ success: true, message: "Order placed!", orderId });
    } catch (err) {
        console.error("Order error:", err);
        res.status(500).json({ success: false });
    }
};

// --- Email Simulation Utility ---
function logOrderEmail(order) {
    console.log("\n" + "=".repeat(60));
    console.log("📧 SIMULATED EMAIL SENT TO: " + (order.email || order.username || "Customer"));
    console.log("-".repeat(60));
    console.log(`Subject: Your Foodie Zone Order ${order.orderId} is confirmed!`);
    console.log("\nHi " + (order.name || "Customer") + ",");
    console.log("Thank you for ordering with Foodie Zone! We've received your order.");
    console.log("\n--- Order Summary ---");
    Object.keys(order.items || {}).forEach(item => {
        console.log(`- ${item} x ${order.items[item].qty} : ₹${order.items[item].price * order.items[item].qty}`);
    });
    console.log("-".repeat(20));
    console.log("Total Paid: ₹" + order.total);
    console.log("Delivery To: " + order.address);
    console.log("\nYou can track your live order here: http://localhost:3000/thanks-order.html?orderId=" + order.orderId);
    console.log("\nHappy Eating!\nTeam Foodie Zone");
    console.log("=".repeat(60) + "\n");
}

// 6. Enquiry
exports.enquire = async (req, res) => {
    try {
        const enquiryId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
        const newEnquiry = new Enquiry({ ...req.body, enquiryId });
        await newEnquiry.save();
        res.json({ success: true, enquiryId });
    } catch (err) { res.status(500).json({ success: false }); }
};

// 7. Job Application
exports.applyJob = async (req, res) => {
    try {
        const appId = 'JOB-' + Math.floor(1000 + Math.random() * 9000);
        const newApp = new JobApplication({ ...req.body, appId });
        await newApp.save();
        res.json({ success: true, appId });
    } catch (err) { res.status(500).json({ success: false }); }
};

// 8. Partner Application
exports.applyPartner = async (req, res) => {
    try {
        const partnerId = 'PTR-' + Math.floor(1000 + Math.random() * 9000);
        const password = req.body.password || "partner123";
        const newPartner = new Partner({ ...req.body, partnerId, password });
        await newPartner.save();
        res.json({ success: true, partnerId });
    } catch (err) { res.status(500).json({ success: false }); }
};

// 9. Partner Login
exports.partnerLogin = async (req, res) => {
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
};

// 10. Partner Dashboard
exports.getPartnerDashboard = async (req, res) => {
    try {
        const partner = await Partner.findOne({ partnerId: req.params.id });
        if (!partner) return res.status(404).json({ message: "Not found" });

        const partnerOrders = await Order.find({
            $or: [
                { partnerId: partner.partnerId },
                { city: partner.city }
            ]
        });
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
};

// 11. Admin Data
exports.getAdminData = async (req, res) => {
    try {
        const [orders, enquiries, jobApplications, partners] = await Promise.all([
            Order.find(),
            Enquiry.find(),
            JobApplication.find(),
            Partner.find()
        ]);
        res.json({ orders, enquiries, jobApplications, partners });
    } catch (err) { res.status(500).json({ success: false }); }
};

// 12. Update Status
exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.findOneAndUpdate({ orderId: req.body.orderId }, { status: req.body.status });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.updatePartnerStatus = async (req, res) => {
    try {
        await Partner.findOneAndUpdate({ partnerId: req.body.partnerId }, { status: req.body.status });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (order) res.json(order); else res.status(404).json({ message: "Not found" });
    } catch (err) { res.status(500).send(); }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userOrders = await Order.find({ username: req.query.username });
        res.json(userOrders);
    } catch (err) { res.json([]); }
};

// 13. Menu
exports.getMenu = async (req, res) => {
    try {
        res.json(await MenuItem.find());
    } catch (err) { res.status(500).json([]); }
};

exports.updateMenu = async (req, res) => {
    try {
        await MenuItem.findOneAndUpdate({ id: req.body.id }, { price: req.body.price, active: req.body.active });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.addMenu = async (req, res) => {
    try {
        const lastItem = await MenuItem.findOne().sort({ id: -1 });
        const newId = lastItem ? lastItem.id + 1 : 1;
        const newItem = new MenuItem({ ...req.body, id: newId, active: true });
        await newItem.save();
        res.json({ success: true, item: newItem });
    } catch (err) { res.status(500).json({ success: false }); }
};
