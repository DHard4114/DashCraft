const express = require("express");
const paymentRepo = require("../repositories/paymentRepository");
const router = express.Router();

router.get('/', paymentRepo.getAllPayments);

router.get('/:paymentId', paymentRepo.getPaymentById);

router.post('/', paymentRepo.addPayment);

router.get('/customer/:customerId', paymentRepo.getPaymentsByCustomer);

router.put('/:paymentId', paymentRepo.updatePayment);

router.delete('/:paymentId', paymentRepo.deletePayment);

module.exports = router;
