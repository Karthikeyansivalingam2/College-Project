const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    price: Number,
    category: String,
    bestseller: Boolean,
    image: String,
    active: { type: Boolean, default: true },
    calories: Number,
    prep_time: String,
    rating: String
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
