const express = require("express");
const paymentRepo = require("../repositories/paymentRepository");
const router = express.Router();

router.get('/', paymentRepo.getAllPayments);

router.get('/:paymentId', paymentRepo.getPaymentById);

router.post('/:paymentId', paymentRepo.addPaymentToStore);

router.get('/store/:storeId', paymentRepo.getPaymentsByStore);

router.put('/:paymentId', paymentRepo.updatePayment);

router.delete('/:deleteId', paymentRepo.deletePayment);

module.exports = router;