// routes/transactionRoutes.js
const express = require('express');
const transactionRepo = require('../repositories/transactionRepository');
const router = express.Router();


// Get all transactions
router.get('/', transactionRepo.getAllTransactions);

// Create a new transaction
router.post('/create', transactionRepo.createTransaction);

// Get transaction by ID
router.get('/:transactionId', transactionRepo.getTransactionById);

// Get transactions by user
router.get('/user/:userId', transactionRepo.getTransactionsByUser);

router.delete('/:transactionId', transactionRepo.deleteTransaction);

module.exports = router;
