const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/errorApi');

class UserRepository {
    // Register user
    static async register(req, res) {
        try {
            const { username, email, password, role = 'user' } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'User with this email or username already exists'
                });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                password,
                role
            });

            // Generate token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token
                },
                message: 'User registered successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide email and password'
                });
            }

            // Find user and include password
            const user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid email or password'
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token
                },
                message: 'Login successful'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: { user },
                message: 'Profile retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update user profile
    static async updateProfile(req, res) {
        try {
            const updates = req.body;
            
            // Remove sensitive fields
            delete updates.password;
            delete updates.role;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updates,
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: { user },
                message: 'Profile updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all users (admin only)
    static async getAllUsers(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. Admin only.'
                });
            }

            const { page = 1, limit = 10, search, role } = req.query;
            const skip = (page - 1) * limit;

            const filter = {};
            if (search) {
                filter.$or = [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            if (role) {
                filter.role = role;
            }

            const users = await User.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await User.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: {
                    users,
                    pagination: {
                        current: parseInt(page),
                        pages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                },
                message: 'Users retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update user role (admin only)
    static async updateUserRole(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. Admin only.'
                });
            }

            const { userId } = req.params;
            const { role } = req.body;

            if (!['user', 'creator', 'admin'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid role'
                });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { role },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: { user },
                message: 'User role updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user addresses
    static async getUserAddresses(req, res) {
        try {
            const user = await User.findById(req.user.id).select('profile.address');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    addresses: user.profile.address || []
                },
                message: 'User addresses retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get default address for shipping
    static async getDefaultAddress(req, res) {
        try {
            const user = await User.findById(req.user.id).select('profile.address profile.firstName profile.lastName profile.phoneNumber username');
            
            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            const defaultAddress = user.profile.address?.find(addr => addr.isDefault);

            if (!defaultAddress) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: 'No default address found'
                });
            }

            // Format for shipping - USE state FROM user model
            const shippingAddress = {
                fullName: `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() || user.username,
                phone: user.profile.phoneNumber || '',
                address: defaultAddress.street,
                city: defaultAddress.city,
                province: defaultAddress.state, // Map state to province
                postalCode: defaultAddress.postalCode,
                country: defaultAddress.country
            };

            res.status(200).json({
                success: true,
                data: {
                    shippingAddress,
                    originalAddress: defaultAddress
                },
                message: 'Default address retrieved successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Add new address - FIXED VERSION
    static async addUserAddress(req, res) {
        try {
            console.log('Request body:', JSON.stringify(req.body, null, 2));

            const { street, city, state, postalCode, country = 'Indonesia', isDefault = false } = req.body;

            // Validate required fields
            if (!street || !city || !state || !postalCode) {
                return res.status(400).json({
                    success: false,
                    error: 'Street, city, state, and postal code are required'
                });
            }

            // Find user and update directly with $push
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Initialize profile and address array if needed
            if (!user.profile) {
                user.profile = { address: [] };
            }
            if (!user.profile.address) {
                user.profile.address = [];
            }

            // If setting as default, update existing addresses
            if (isDefault || user.profile.address.length === 0) {
                // Use findByIdAndUpdate to unset default from existing addresses
                await User.updateOne(
                    { _id: req.user.id },
                    { $set: { 'profile.address.$[].isDefault': false } }
                );
            }

            // Create new address object
            const newAddress = {
                street: street.trim(),
                city: city.trim(),
                state: state.trim(),
                postalCode: postalCode.trim(),
                country: country.trim(),
                isDefault: isDefault || user.profile.address.length === 0
            };

            console.log('Adding address:', newAddress);

            // Use $push to add new address
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $push: { 'profile.address': newAddress } },
                { new: true, runValidators: false } // Disable validators for nested documents
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    error: 'Failed to update user'
                });
            }

            const addedAddress = updatedUser.profile.address[updatedUser.profile.address.length - 1];

            res.status(201).json({
                success: true,
                data: {
                    address: addedAddress,
                    addresses: updatedUser.profile.address
                },
                message: 'Address added successfully'
            });

        } catch (error) {
            console.error('Add address error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update address
    static async updateUserAddress(req, res) {
        try {
            const { addressId } = req.params;
            const { street, city, state, postalCode, country, isDefault } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const address = user.profile.address.id(addressId);
            if (!address) {
                return res.status(404).json({
                    success: false,
                    error: 'Address not found'
                });
            }

            // Update address fields
            if (street) address.street = street;
            if (city) address.city = city;
            if (state) address.state = state;
            if (postalCode) address.postalCode = postalCode;
            if (country) address.country = country;

            // Handle default address
            if (isDefault === true) {
                // Remove default from other addresses
                user.profile.address.forEach(addr => {
                    if (addr._id.toString() !== addressId) {
                        addr.isDefault = false;
                    }
                });
                address.isDefault = true;
            } else if (isDefault === false) {
                address.isDefault = false;
            }

            await user.save();

            res.status(200).json({
                success: true,
                data: {
                    address,
                    addresses: user.profile.address
                },
                message: 'Address updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Set default address
    static async setDefaultAddress(req, res) {
        try {
            const { addressId } = req.params;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const address = user.profile.address.id(addressId);
            if (!address) {
                return res.status(404).json({
                    success: false,
                    error: 'Address not found'
                });
            }

            // Remove default from all addresses
            user.profile.address.forEach(addr => {
                addr.isDefault = false;
            });

            // Set new default
            address.isDefault = true;
            await user.save();

            res.status(200).json({
                success: true,
                data: {
                    addresses: user.profile.address
                },
                message: 'Default address updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async verifyToken(req, res) {
        try {
            // If middleware passes, token is valid
            const user = await User.findById(req.user.id).select('-password');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                },
                message: 'Token is valid'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    
    // Delete address
    static async deleteUserAddress(req, res) {
        try {
            const { addressId } = req.params;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const address = user.profile.address.id(addressId);
            if (!address) {
                return res.status(404).json({
                    success: false,
                    error: 'Address not found'
                });
            }

            const wasDefault = address.isDefault;
            
            // Remove address using pull
            user.profile.address.pull(addressId);

            // If deleted address was default, make first remaining address default
            if (wasDefault && user.profile.address.length > 0) {
                user.profile.address[0].isDefault = true;
            }

            await user.save();

            res.status(200).json({
                success: true,
                data: {
                    addresses: user.profile.address
                },
                message: 'Address deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = UserRepository;