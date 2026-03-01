const mongoose = require('mongoose');

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

module.exports = mongoose.model('Enquiry', EnquirySchema);
