const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    partnerId: { type: String, unique: true },
    businessName: String,
    mobile: String,
    city: String,
    password: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partner', PartnerSchema);
