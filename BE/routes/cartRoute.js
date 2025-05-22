const express = require('express');
const router = express.Router();
const cartRepo = require('../repositories/cartRepository');

router.get('/', cartRepo.getAllCarts);
router.get('/:customerId', cartRepo.getCartByCustomer);
router.post('/', cartRepo.addItemToCart);
router.put('/update', cartRepo.updateCartItem);
router.delete('/remove', cartRepo.removeItemFromCart);
router.delete('/clear/:customerId', cartRepo.clearCart);

module.exports = router;
