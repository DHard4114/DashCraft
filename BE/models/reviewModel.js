const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5'],
    },
    comment: {
        type: String,
        required: true,
        minlength: [5, 'Comment must be at least 5 characters long'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
