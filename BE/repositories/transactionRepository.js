const User = require('../models/userModel');
const Item = require('../models/itemModel');
const Store = require('../models/storeModel');
const Transaction = require('../models/transactionModel');

async function createTransaction(req, res) {
    try {
        const { userId, itemId, quantity } = req.query;
    
        if (!userId || !itemId || !quantity) {
            return res.status(400).json({ success: false, message: "userId, itemId, and quantity are required in query params" });
        }
    
        const user = await User.findById(userId);  // Pastikan User didefinisikan
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
    
        const item = await Item.findById(itemId).populate("store");
        if (!item) {
            return res.status(400).json({ success: false, message: "Item not found" });
        }
    
        const store = await Store.findById(item.store._id);
        if (!store) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }
    
        const totalPrice = item.price * quantity;
    
        const transaction = new Transaction({
            user: userId,
            item: itemId,
            quantity,
            totalPrice,
            store: store._id,
        });
    
        await transaction.save();
    
        item.quantity -= quantity;
        await item.save();
    
        res.status(200).json({ success: true, message: "Transaction created successfully", data: transaction });
        } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
async function getAllTransactions(req, res) {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'username')
            .populate('item', 'name price')
            .populate('store', 'name description');

        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getTransactionById(req, res) {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId)
            .populate('user', 'username')
            .populate('item', 'name price')
            .populate('store', 'name description');

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getTransactionsByUser(req, res) {
    try {
        const { userId } = req.params;
        console.log("Searching for transactions for userId:", userId);

        const transactions = await Transaction.find({ user: userId })
            .populate('item', 'name price')
            .populate('store', 'name description');

        console.log("Transactions found:", transactions);

        if (!transactions.length) {
            return res.status(404).json({ success: false, message: "No transactions found for this user" });
        }

        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteTransaction(req, res) {
    try {
        const { transactionId } = req.params;

        const transaction = await Transaction.findById(transactionId).populate('item');
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        const item = transaction.item;
        item.quantity += transaction.quantity;
        await item.save();

        await transaction.deleteOne();

        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    getTransactionsByUser,
    deleteTransaction
};
