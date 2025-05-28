const User = require('../models/userModel');

class UserRepository {
    // Create user
    async create(userData) {
        try {
            const user = new User(userData);
            const savedUser = await user.save();
            return { success: true, data: savedUser };
        } catch (err) {
            console.error('Error creating user:', err);
            return { success: false, message: err.message };
        }
    }

    // Get all users
    async getAll(filters = {}) {
        try {
            const users = await User.find(filters);
            return { success: true, data: users };
        } catch (err) {
            console.error('Error getting all users:', err);
            return { success: false, message: err.message };
        }
    }

    // Get user by ID
    async getById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            return { success: true, data: user };
        } catch (err) {
            console.error('Error getting user by ID:', err);
            return { success: false, message: err.message };
        }
    }

    // Get user by email
    async getByEmail(email) {
        try {
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            return { success: true, data: user };
        } catch (err) {
            console.error('Error getting user by email:', err);
            return { success: false, message: err.message };
        }
    }

    // Update user
    async update(id, updateData) {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            return { success: true, data: user };
        } catch (err) {
            console.error('Error updating user:', err);
            return { success: false, message: err.message };
        }
    }

    // Delete user
    async delete(id) {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            return { success: true, data: user };
        } catch (err) {
            console.error('Error deleting user:', err);
            return { success: false, message: err.message };
        }
    }

    // Get users with pagination
    async getPaginated(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const users = await User.find(filters)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            
            const total = await User.countDocuments(filters);
            
            return {
                success: true,
                data: {
                    users,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: limit
                    }
                }
            };
        } catch (err) {
            console.error('Error getting paginated users:', err);
            return { success: false, message: err.message };
        }
    }
}

module.exports = new UserRepository();