const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const ApiError = require('../utils/errorApi');
const mongoose = require('mongoose');

class ReviewRepository {
    // Add review
    static async addReview(req, res) {
        try {
            const { itemId } = req.params;
            const { rating, comment } = req.body;

            // Validate rating
            if (!rating || rating < 1 || rating > 5) {
                throw new ApiError(400, 'Rating must be between 1 and 5');
            }

            // Check if user bought this item and it's delivered
            const order = await Order.findOne({
                user: req.user.id,
                'items.item': itemId,
                status: 'delivered'
            });

            if (!order) {
                throw new ApiError(400, 'You can only review items you have purchased and received');
            }

            // Check if already reviewed
            const existingReview = await Review.findOne({
                item: itemId,
                user: req.user.id
            });

            if (existingReview) {
                throw new ApiError(400, 'You have already reviewed this item');
            }

            const review = new Review({
                item: itemId,
                user: req.user.id,
                order: order._id,
                rating: parseInt(rating),
                comment: comment?.trim() || ''
            });

            await review.save();

            // Populate for response
            await review.populate([
                { path: 'user', select: 'username' },
                { path: 'item', select: 'name' }
            ]);

            res.status(201).json({
                success: true,
                data: review,
                message: 'Review added successfully'
            });
        } catch (error) {
            console.error('Add review error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get item reviews
    static async getItemReviews(req, res) {
        try {
            const { itemId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                throw new ApiError(400, 'Invalid item ID');
            }

            const skip = (page - 1) * limit;

            const reviews = await Review.find({ 
                item: itemId, 
                isHidden: false 
            })
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

            // Calculate statistics
            const stats = await Review.aggregate([
                { $match: { item: new mongoose.Types.ObjectId(itemId), isHidden: false } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 },
                        ratingDistribution: {
                            $push: '$rating'
                        }
                    }
                }
            ]);

            // Calculate rating breakdown
            let ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            if (stats[0]?.ratingDistribution) {
                stats[0].ratingDistribution.forEach(rating => {
                    ratingBreakdown[rating]++;
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    reviews,
                    statistics: {
                        averageRating: Number((stats[0]?.averageRating || 0).toFixed(1)),
                        totalReviews: stats[0]?.totalReviews || 0,
                        ratingBreakdown
                    },
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil((stats[0]?.totalReviews || 0) / limit),
                        hasNext: skip + reviews.length < (stats[0]?.totalReviews || 0)
                    }
                }
            });
        } catch (error) {
            console.error('Get reviews error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Check if user can review
    static async canUserReview(req, res) {
        try {
            const { itemId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                throw new ApiError(400, 'Invalid item ID');
            }

            const order = await Order.findOne({
                user: req.user.id,
                'items.item': itemId,
                status: 'delivered'
            });

            const existingReview = await Review.findOne({
                item: itemId,
                user: req.user.id
            });

            res.status(200).json({
                success: true,
                data: {
                    canReview: !!order && !existingReview,
                    hasPurchased: !!order,
                    hasReviewed: !!existingReview,
                    reason: !order ? 'Item not purchased or not delivered yet' : 
                           existingReview ? 'Already reviewed' : 'Can review'
                }
            });
        } catch (error) {
            console.error('Can review check error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user's reviews
    static async getUserReviews(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const reviews = await Review.find({ user: req.user.id })
                .populate([
                    { path: 'item', select: 'name slug images price' },
                    { path: 'order', select: 'orderNumber' }
                ])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const totalReviews = await Review.countDocuments({ user: req.user.id });

            res.status(200).json({
                success: true,
                data: {
                    reviews,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(totalReviews / limit),
                        totalReviews
                    }
                }
            });
        } catch (error) {
            console.error('Get user reviews error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ReviewRepository;