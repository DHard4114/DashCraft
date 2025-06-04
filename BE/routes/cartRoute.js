const express = require('express');
const CartRepository = require('../repositories/cartRepository.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.get('/', CartRepository.getUserCart);
router.get('/summary', CartRepository.getCartSummary);
router.get('/count', CartRepository.getCartItemCount);
router.get('/check/:itemId', CartRepository.isItemInCart);
router.post('/add', CartRepository.addItemToCart);
router.put('/item/:itemId', CartRepository.updateCartItemQuantity);
router.put('/sync', CartRepository.syncCartPrices);
router.delete('/item/:itemId', CartRepository.removeItemFromCart);
router.delete('/clear', CartRepository.clearUserCart);

module.exports = router;