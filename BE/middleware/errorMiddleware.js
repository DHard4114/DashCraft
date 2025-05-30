const ApiError = require('../utils/errorApi');

function errorHandler(err, req, res, next) {
    console.error('Error:', err.stack);

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            status: 'fail',
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            status: 'fail',
            message: 'Token expired'
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            status: 'fail',
            message: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
}

module.exports = errorHandler;