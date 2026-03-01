const mongoose = require('mongoose');

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

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
