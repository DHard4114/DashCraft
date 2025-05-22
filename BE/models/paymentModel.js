const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be non-negative'],
    },
    method: {
        type: String,
        enum: [
        'paypal',
        'visa',
        'mastercard',
        'ovo',
        'gopay',
        'shopeepay',
        'credit_card',
        'debit_card',
        'bank_transfer',
        'cash',
        'other'
        ],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true,
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
