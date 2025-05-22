const Payment = require("../models/paymentModel");
const Customer = require("../models/customerModel");

async function getAllPayments(req, res) {
    try {
        const payments = await Payment.find()
            .populate("customerId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: payments
        });
    } catch (err) {
        console.error("Error while fetching all payments: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function addPayment(req, res) {
    try {
        const { amount, method, paymentDate, customerId, paymentDetails, transactionId, status } = req.body;

        if (!amount || !method || !customerId) {
            return res.status(400).json({ success: false, message: "amount, method, and customerId are required" });
        }

        if (amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
        }

        const customerExist = await Customer.findById(customerId);
        if (!customerExist) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const payment = new Payment({
            amount,
            method,
            paymentDate: paymentDate || Date.now(),
            customerId,
            paymentDetails: paymentDetails || {},
            transactionId: transactionId || undefined,
            status: status || 'pending',
        });

        await payment.save();

        res.status(201).json({ success: true, message: "Payment created successfully", data: payment });
    } catch (err) {
        console.error("Error while adding payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getPaymentsByCustomer(req, res) {
    try {
        const { customerId } = req.params;
        const payments = await Payment.find({ customerId }).sort({ paymentDate: -1 });

        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        console.error("Error while fetching payments by customer: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getPaymentById(req, res) {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        console.error("Error while fetching payment by id: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updatePayment(req, res) {
    try {
        const { paymentId } = req.params;
        const updates = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (updates.amount !== undefined) payment.amount = updates.amount;
        if (updates.method) payment.method = updates.method;
        if (updates.paymentDate) payment.paymentDate = updates.paymentDate;
        if (updates.status) payment.status = updates.status;
        if (updates.transactionId !== undefined) payment.transactionId = updates.transactionId;
        if (updates.paymentDetails !== undefined) payment.paymentDetails = updates.paymentDetails;

        if (updates.customerId) {
            const customerExist = await Customer.findById(updates.customerId);
            if (!customerExist) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }
            payment.customerId = updates.customerId;
        }

        const updatedPayment = await payment.save();

        res.status(200).json({ success: true, message: "Payment updated", data: updatedPayment });
    } catch (err) {
        console.error("Error while updating payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deletePayment(req, res) {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        await Payment.findByIdAndDelete(paymentId);

        res.status(200).json({ success: true, message: "Payment deleted" });
    } catch (err) {
        console.error("Error while deleting payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    getAllPayments,
    addPayment,
    getPaymentsByCustomer,
    getPaymentById,
    updatePayment,
    deletePayment
};
