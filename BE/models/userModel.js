const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define address schema WITHOUT required validation (validate in repository instead)
const addressSchema = new mongoose.Schema({
    street: {
        type: String
        // Remove required validation here
    },
    city: {
        type: String
        // Remove required validation here
    },
    state: {
        type: String
        // Remove required validation here
    },
    postalCode: {
        type: String
        // Remove required validation here
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    _id: true
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin'],
        default: 'user'
    },
    profile: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: [addressSchema]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ 'profile.phoneNumber': 1 });

module.exports = mongoose.model('User', userSchema);