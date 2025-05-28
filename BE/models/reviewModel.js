const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    // DIY specific ratings
    aspects: {
        quality: { type: Number, min: 1, max: 5 },
        instructions: { type: Number, min: 1, max: 5 },
        difficulty: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 }
    },
    projectImages: [{
        url: String,
        description: String,
        alt: String
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: true
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    // Response from seller/admin
    response: {
        comment: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    }
}, { timestamps: true });

reviewSchema.index({ customer: 1, item: 1, order: 1 }, { unique: true });
reviewSchema.index({ item: 1, isApproved: 1 });
reviewSchema.index({ rating: -1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);