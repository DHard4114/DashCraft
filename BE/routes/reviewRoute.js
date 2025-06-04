const express = require('express');
const ReviewRepository = require('../repositories/reviewRepository');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/item/:itemId', ReviewRepository.getItemReviews);

// Protected routes
router.use(authMiddleware);

// User can review check
router.get('/can-review/:itemId', ReviewRepository.canUserReview);

// Add review
router.post('/:itemId', ReviewRepository.addReview);

// Get user's own reviews
router.get('/my-reviews', ReviewRepository.getUserReviews);

module.exports = router;