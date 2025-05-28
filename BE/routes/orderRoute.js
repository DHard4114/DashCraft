const express = require('express');
const router = express.Router();
const orderRepo = require('../repositories/orderRepository');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateToken);

// Customer routes
router.post('/create-from-cart', orderRepo.createFromCart);
router.get('/my-orders', orderRepo.getCustomerOrders);
router.get('/my-orders/:orderId', orderRepo.getOrderById);

// Admin routes
router.use(authorizeRoles('admin'));
router.get('/', orderRepo.getAllOrders);
router.get('/:orderId', orderRepo.getOrderById);
router.patch('/:orderId/status', orderRepo.updateOrderStatus);
router.patch('/:orderId/tracking', orderRepo.updateTracking);
router.post('/:orderId/refund', orderRepo.initiateRefund);

module.exports = router;
