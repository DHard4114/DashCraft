const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp <= currentTimestamp) {
            return res.status(401).json({
                success: false,
                error: 'Token has expired',
                expired: true
            });
        }

        // Get user from token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User no longer exists'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired',
                expired: true
            });
        }

        res.status(401).json({
            success: false,
            error: 'Not authorized'
        });
    }
};