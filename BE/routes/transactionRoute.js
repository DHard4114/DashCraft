const express = require('express');
const transactionRepo = require('../repositories/transactionRepository');
const router = express.Router();

router.get('/', transactionRepo.getAllTransactions);

router.post('/create', transactionRepo.createTransaction);

router.get('/:transactionId', transactionRepo.getTransactionById);

router.get('/user/:userId', transactionRepo.getTransactionsByUser);

router.delete('/:transactionId', transactionRepo.deleteTransaction);

module.exports = router;
