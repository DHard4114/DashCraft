const express = require('express');
const UserRepository = require('../repositories/userRepository');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes (public)
router.post('/register', UserRepository.register);
router.post('/login', UserRepository.login);
router.get('/verify', authMiddleware, UserRepository.verifyToken);

// Protected routes
router.use(authMiddleware);

// Profile routes
router.get('/profile', UserRepository.getProfile);
router.put('/profile', UserRepository.updateProfile);

// Address management routes
router.get('/addresses', UserRepository.getUserAddresses);
router.get('/addresses/default', UserRepository.getDefaultAddress);
router.post('/addresses', UserRepository.addUserAddress);
router.put('/addresses/:addressId', UserRepository.updateUserAddress);
router.put('/addresses/:addressId/default', UserRepository.setDefaultAddress);
router.delete('/addresses/:addressId', UserRepository.deleteUserAddress);

// Admin routes
router.get('/all', UserRepository.getAllUsers);
router.put('/:userId/role', UserRepository.updateUserRole);

module.exports = router;