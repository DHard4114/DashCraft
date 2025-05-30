const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative']
    }
}, {
    _id: false
});

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    province: {
        type: String,
        required: [true, 'Province is required']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required']
    },
    country: {
        type: String,
        default: 'Indonesia'
    }
}, {
    _id: false
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function(items) {
                return items && items.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    subtotal: {
        type: Number,
        min: 0
        // Remove required: true, will be calculated in pre-save
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        min: 0
        // Remove required: true, will be calculated in pre-save
    },
    status: {
        type: String,
        enum: [
            'pending',
            'paid', 
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        ],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'e_wallet', 'credit_card', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'pending_verification', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        amount: Number,
        bankAccount: String,
        paymentProof: String,
        notes: String,
        instructions: [String],
        expiredAt: Date,
        uploadedAt: Date,
        verifiedAt: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rejectionReason: String
    },
    tracking: {
        courier: String,
        trackingNumber: String,
        shippedDate: Date,
        deliveredDate: Date,
        estimatedDelivery: Date
    },
    notes: {
        type: String,
        maxlength: 500
    },
    cancelReason: {
        type: String,
        maxlength: 500
    },
    refundReason: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        this.orderNumber = `DC-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
    }
    next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.subtotal = this.items.reduce((total, item) => total + (item.subtotal || 0), 0);
        this.totalAmount = this.subtotal + (this.shippingCost || 0) + (this.tax || 0) - (this.discount || 0);
    }
    next();
});

// Methods
orderSchema.methods.updateStatus = function(status, additionalData = {}) {
    this.status = status;
    
    if (status === 'paid' || status === 'processing') {
        this.paymentStatus = 'paid';
        this.paymentDetails.paymentDate = new Date();
    }
    
    if (status === 'shipped' && additionalData.tracking) {
        this.tracking = { ...this.tracking, ...additionalData.tracking };
        this.tracking.shippedDate = new Date();
    }
    
    if (status === 'delivered') {
        this.tracking.deliveredDate = new Date();
    }
    
    if (status === 'cancelled' && additionalData.reason) {
        this.cancelReason = additionalData.reason;
    }
    
    if (status === 'refunded' && additionalData.reason) {
        this.refundReason = additionalData.reason;
        this.paymentStatus = 'refunded';
    }
    
    return this.save();
};

orderSchema.methods.addPayment = function(paymentData) {
    this.paymentDetails = { ...this.paymentDetails, ...paymentData };
    this.paymentStatus = 'paid';
    this.status = 'paid';
    return this.save();
};

orderSchema.methods.canBeCancelled = function() {
    return ['pending', 'paid'].includes(this.status);
};

orderSchema.methods.canBeRefunded = function() {
    return ['paid', 'processing', 'shipped'].includes(this.status);
};

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);