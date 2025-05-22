const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', reviewController.createReview);

router.get('/', reviewController.getAllReviews);

router.get('/my-reviews', reviewController.getReviewsByUser);

router.get('/item/:itemId', reviewController.getReviewsByItem);

router.get('/:id', reviewController.getReviewById);

router.put('/:id', reviewController.updateReview);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;