const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

async function addUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "username, email, and password are required" });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully", data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "username and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid password");

        res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getAllUser(req, res) {
    try {
        const users = await User.find().sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getUserById(req, res) {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getUserTransactions(req, res) {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate({
            path: "transactions",
            populate: {
                path: "items",
                model: "Item"
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.transactions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await Transaction.deleteMany({ user: userId });
        await user.deleteOne();

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function changePassword(req, res) {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) throw new Error("Old password is incorrect");

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function topUp(req, res) {
    try {
        const { userId, amount } = req.body;

        if (!userId || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid userId and positive amount are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.balance += amount;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Top up successful. New balance: ${user.balance}`,
            data: { balance: user.balance }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


module.exports = {
    addUser,
    login,
    getAllUser,
    getUserById,
    getUserTransactions,
    deleteUser,
    changePassword
};
