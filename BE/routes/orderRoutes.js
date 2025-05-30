const express = require('express');
const OrderRepository = require('../repositories/orderRepository');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// User order routes
router.post('/create', OrderRepository.createOrderFromCart);
router.get('/my-orders', OrderRepository.getUserOrders);
router.get('/number/:orderNumber', OrderRepository.getOrderByNumber);
router.get('/:orderId', OrderRepository.getOrderById);

// Payment routes
router.post('/:orderId/payment/initiate', OrderRepository.initiatePayment);
router.put('/:orderId/payment/proof', uploadSingle('paymentProof'), OrderRepository.uploadPaymentProof);
router.put('/:orderId/payment/verify', OrderRepository.verifyPayment);
router.put('/:orderId/cancel', OrderRepository.cancelOrder);

// Admin only routes
router.get('/', OrderRepository.getAllOrders);
router.get('/admin/stats', OrderRepository.getOrderStats);
router.get('/admin/payment-status', OrderRepository.getOrdersByPaymentStatus);
router.get('/admin/pending-verification', OrderRepository.getOrdersByPaymentStatus);
router.put('/:orderId/status', OrderRepository.updateOrderStatus);
router.put('/:orderId/shipping', OrderRepository.updateShippingTracking);
router.put('/:orderId/delivered', OrderRepository.markAsDelivered);

module.exports = router;