const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be greater than or equal to 0'],
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity must be greater than or equal to 0'],
        default: 1,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
