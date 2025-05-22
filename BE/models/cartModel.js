const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    priceAtAddition: {
        type: Number,
        required: true,
        min: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
    });

    const cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
    status: {
        type: String,
        enum: ['active', 'ordered', 'cancelled'],
        default: 'active',
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    }, { timestamps: true });

    cartSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
