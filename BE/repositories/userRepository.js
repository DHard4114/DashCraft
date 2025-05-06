const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

async function addUser(req, res) {
    try {
        
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "username and password are required in query params" });
        }

        const user = new User({ username: username, password: password });
        await user.save();

        res.status(200).json({ success: true, message: "Successfully Registered User", data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function login(req, res) {
    try {

        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "username and password are required in query params" });
        }
        
        const user = await User.findOne({ username: username });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid Password");

        res.status(200).json({ success: true, message: "Found user", data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getAllUser(req, res) {
    try {
        const users = await User.find().sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getUserById(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        res.status(200).json({
            success: true,
            message: `Found user with id ${userId}`,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}


async function getUserTransactions(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId })
            .populate({
                path: "transactions",
                populate: {
                    path: "items",
                    model: "Item"
                }
            });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Successfully retrieved transactions from user",
            data: [user]
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(err);
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await Transaction.deleteMany({ user: userId });

        await user.remove();

        res.status(200).json({
            success: true,
            message: `User with id ${userId} has been deleted`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function changePassword(req, res) {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Old password is incorrect");

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
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
