const Payment = require("../models/paymentModel");
const Store = require("../models/storeModel");

async function getAllPayments(req, res) {
    try {
        const payments = await Payment.find()
            .populate("store", "name")
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

async function addPaymentToStore(req, res) {
    try {
        const { amount, method, date, store } = req.body;

        if (!amount || !method || !date || !store) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
        }

        const storeExist = await Store.findById(store);
        if (!storeExist) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }

        const payment = new Payment({
            amount,
            method,
            date,
            store,
        });

        await payment.save();

        storeExist.payments.push(payment._id);
        await storeExist.save();

        res.status(200).json({ success: true, message: "Payment added to store", data: payment });
    } catch (err) {
        console.error("Error while adding payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getPaymentsByStore(req, res) {
    try {
        const { storeId } = req.params;
        const store = await Store.findById(storeId).populate("payments", "amount method date");
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        res.status(200).json({ success: true, data: store.payments });
    } catch (err) {
        console.error("Error while get payments by store: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

// Get payment by ID
async function getPaymentById(req, res) {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        console.error("Error while get payment by id: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

const updatePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (req.body.amount) {
            payment.amount = req.body.amount;
        }

        if (req.body.method) {
            payment.method = req.body.method;
        }

        if (req.body.date) {
            payment.date = req.body.date;
        }

        if (req.body.storeId) {
            const store = await Store.findById(req.body.storeId);
            if (!store) {
                return res.status(400).json({ success: false, message: "Store not found" });
            }
            payment.store = req.body.storeId;
        }

        const updatedPayment = await payment.save();

        res.status(200).json({ success: true, message: "Payment updated", data: updatedPayment });
    } catch (err) {
        console.error("Error while update payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
};

async function deletePayment(req, res) {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        const store = await Store.findById(payment.store);
        store.payments.pull(paymentId);
        await store.save();

        await Payment.findByIdAndDelete(paymentId);

        res.status(200).json({ success: true, message: "Payment deleted" });
    } catch (err) {
        console.error("Error while delete payment: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    addPaymentToStore,
    getPaymentsByStore,
    getPaymentById,
    updatePayment,
    deletePayment,
    getAllPayments
};
