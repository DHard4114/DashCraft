const express = require('express');
const router = express.Router();
const paymentRepo = require('../repositories/paymentRepository');
const { authenticateToken } = require('../middleware/authMiddleware');

// Customer routes
router.post('/process', paymentRepo.processPayment);
router.get('/my-payments', paymentRepo.getCustomerPayments);
router.get('/my-payments/:paymentId', paymentRepo.getPaymentById);

// Payment method management
router.get('/methods', paymentRepo.getCustomerPaymentMethods);
router.post('/methods', paymentRepo.addPaymentMethod);
router.put('/methods/:methodId', paymentRepo.updatePaymentMethod);
router.delete('/methods/:methodId', paymentRepo.deletePaymentMethod);

router.get('/', paymentRepo.getAllPayments);
router.get('/:paymentId', paymentRepo.getPaymentById);
router.patch('/:paymentId/status', paymentRepo.updatePaymentStatus);
router.post('/:paymentId/refund', paymentRepo.processRefund);

module.exports = router;
