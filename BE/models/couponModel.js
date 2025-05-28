const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    // Minimum purchase amount
    minPurchase: {
        type: Number,
        default: 0,
        min: 0
    },
    // Maximum discount amount (for percentage coupons)
    maxDiscount: {
        type: Number,
        min: 0
    },
    // Usage limits
    usageLimit: {
        total: { type: Number, default: null }, // null = unlimited
        perCustomer: { type: Number, default: 1 }
    },
    usageCount: {
        type: Number,
        default: 0
    },
    // Date validity
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    // Applicable to specific categories or items
    applicableTo: {
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }]
    },
    // Customer restrictions
    customerRestrictions: {
        newCustomersOnly: { type: Boolean, default: false },
        specificCustomers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

couponSchema.virtual('isValid').get(function() {
    const now = new Date();
    return this.isActive && 
           now >= this.validFrom && 
           now <= this.validUntil &&
           (this.usageLimit.total === null || this.usageCount < this.usageLimit.total);
});

couponSchema.methods.canBeUsedBy = function(customerId, customerOrderCount = 0) {
    if (!this.isValid) return false;
    
    // Check if new customer only restriction
    if (this.customerRestrictions.newCustomersOnly && customerOrderCount > 0) {
        return false;
    }
    
    // Check if specific customer restriction exists
    if (this.customerRestrictions.specificCustomers.length > 0) {
        return this.customerRestrictions.specificCustomers.includes(customerId);
    }
    
    return true;
};

couponSchema.methods.calculateDiscount = function(subtotal, applicableItems = []) {
    if (!this.isValid || subtotal < this.minPurchase) return 0;
    
    let discountableAmount = subtotal;
    
    // If coupon is restricted to specific categories/items
    if (this.applicableTo.categories.length > 0 || this.applicableTo.items.length > 0) {
        discountableAmount = applicableItems.reduce((sum, item) => {
            const itemTotal = item.quantity * item.price;
            // Check if item's category or item itself is in applicable list
            const isApplicable = this.applicableTo.categories.includes(item.categoryId) ||
                                this.applicableTo.items.includes(item.itemId);
            return isApplicable ? sum + itemTotal : sum;
        }, 0);
    }
    
    let discount = 0;
    if (this.type === 'percentage') {
        discount = Math.round(discountableAmount * (this.value / 100));
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = Math.min(this.value, discountableAmount);
    }
    
    return discount;
};

couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);