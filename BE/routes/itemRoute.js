const express = require('express');
const router = express.Router();
const ItemRepository = require('../repositories/itemRepository');
const { authMiddleware } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const upload = require('../utils/multer');

// Public routes
router.get('/', ItemRepository.getAllItems);
router.get('/category/:categorySlug', ItemRepository.getItemsByCategory);
router.get('/:slug', ItemRepository.getItemBySlug);

// Protected routes
router.use(authMiddleware);

// Creator and Admin routes
router.post(
    '/',
    authorizeRoles('admin', 'creator'),
    upload.array('images', 5),
    ItemRepository.createItem
);

router.put(
    '/:id',
    authorizeRoles('admin', 'creator'),
    upload.array('images', 5),
    ItemRepository.updateItem
);

router.delete(
    '/:id',
    authorizeRoles('admin', 'creator'),
    ItemRepository.deleteItem
);

// Rating routes
router.post('/:itemId/rating', ItemRepository.addRating);
router.get('/:itemId/ratings', ItemRepository.getItemRatings);

module.exports = router;