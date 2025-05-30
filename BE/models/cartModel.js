const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative']
    }
}, {
    _id: false
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // This creates an index automatically
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
    this.lastUpdated = new Date();
    next();
});

// Methods
cartSchema.methods.addItem = function(itemData) {
    const existingItemIndex = this.items.findIndex(
        item => item.item.toString() === itemData.item.toString()
    );

    if (existingItemIndex > -1) {
        // Update existing item
        this.items[existingItemIndex].quantity += itemData.quantity;
        this.items[existingItemIndex].subtotal = 
            this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
    } else {
        // Add new item
        const newItem = {
            item: itemData.item,
            quantity: itemData.quantity,
            price: itemData.price,
            subtotal: itemData.quantity * itemData.price
        };
        this.items.push(newItem);
    }

    return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
    this.items = this.items.filter(item => item.item.toString() !== itemId.toString());
    return this.save();
};

cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
    const itemIndex = this.items.findIndex(
        item => item.item.toString() === itemId.toString()
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            this.items.splice(itemIndex, 1);
        } else {
            this.items[itemIndex].quantity = quantity;
            this.items[itemIndex].subtotal = quantity * this.items[itemIndex].price;
        }
    }

    return this.save();
};

cartSchema.methods.clearCart = function() {
    this.items = [];
    return this.save();
};

// Only add indexes that are not automatically created
// cartSchema.index({ user: 1 }); // Remove this - already created by unique: true
cartSchema.index({ 'items.item': 1 });
cartSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Cart', cartSchema);