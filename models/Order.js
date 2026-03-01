const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: String,
    partnerId: { type: String, default: null }, // Linked partner if assigned
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

module.exports = mongoose.model('Order', OrderSchema);
