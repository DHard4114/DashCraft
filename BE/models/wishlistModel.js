const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

wishlistSchema.virtual('totalItems').get(function() {
    return this.items.length;
});

wishlistSchema.index({ customer: 1 });
wishlistSchema.index({ 'items.item': 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);