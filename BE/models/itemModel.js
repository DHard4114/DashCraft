const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false }
    }],
    inventory: {
        quantity: { type: Number, required: true, default: 0 },
        trackQuantity: { type: Boolean, default: true },
        lowStockThreshold: { type: Number, default: 5 }
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'discontinued'],
        default: 'draft'
    },
    // DIY specific fields
    diy: {
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        estimatedTime: String,
        instructions: [{
            step: { type: Number, required: true },
            title: String,
            description: { type: String, required: true },
            image: String,
            tips: [String]
        }],
        materialsIncluded: [String],
        toolsRequired: [String],
        tags: [String]
    },
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    // SEO fields
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    // Sales tracking
    salesCount: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true }
});

itemSchema.virtual('primaryImage').get(function() {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images[0]?.url || null);
});

itemSchema.virtual('stockStatus').get(function() {
    if (!this.inventory.trackQuantity) return 'in_stock';
    if (this.inventory.quantity === 0) return 'out_of_stock';
    if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'low_stock';
    return 'in_stock';
});

itemSchema.virtual('finalPrice').get(function() {
    return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
});

itemSchema.virtual('hasDiscount').get(function() {
    return this.discountPrice && this.discountPrice < this.price;
});

itemSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

itemSchema.index({ slug: 1 });
itemSchema.index({ sku: 1 });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ name: 'text', description: 'text', 'diy.tags': 'text' });
itemSchema.index({ 'rating.average': -1, salesCount: -1 });

module.exports = mongoose.model('Item', itemSchema);