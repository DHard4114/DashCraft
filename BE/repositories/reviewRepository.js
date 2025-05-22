const Review = require('../models/reviewModel');
const Item = require('../models/itemModel');

const updateItemAverageRating = async (itemId) => {
    const reviews = await Review.find({ item: itemId });
    if (reviews.length === 0) return;

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Item.findByIdAndUpdate(itemId, { averageRating: averageRating.toFixed(1) });
};

exports.createReview = async (req, res) => {
    try {
        const { item, rating, comment } = req.body;
        const user = req.user._id;

        const review = new Review({ user, item, rating, comment });
        await review.save();

        await updateItemAverageRating(item);

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const filter = req.query.item ? { item: req.query.item } : {};
        const reviews = await Review.find(filter)
            .populate('user', 'name') 
            .populate('item', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name')
            .populate('item', 'name');

        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (String(review.user) !== String(req.user._id)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;

        await review.save();
        await updateItemAverageRating(review.item);

        res.json({ message: 'Review updated', review });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (String(review.user) !== String(req.user._id)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Review.deleteOne({ _id: req.params.id });
        await updateItemAverageRating(review.item);

        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
