const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    code: {
        type: String,
        required: [true, 'Category code is required'],
        uppercase: true,
        maxlength: [10, 'Code cannot exceed 10 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: 'fa-folder'
    },
    theme: {
        type: String,
        enum: [
            'eco-friendly',
            'textile-crafts', 
            'home-decor',
            'jewelry-making',
            'art-painting',
            'natural-materials',
            'upcycling',
            'traditional-crafts'
        ],
        required: true
    },
    materials: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        properties: [String],
        uses: [String],
        sustainability: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    itemCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create indexes using schema.index() only (avoid duplicates)
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ code: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ status: 1 });
categorySchema.index({ theme: 1 });

// Generate slug before saving - FIX: ensure it always generates
categorySchema.pre('save', function(next) {
    // Always generate slug if it doesn't exist or name is modified
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

// Also add pre-insertMany hook for bulk operations
categorySchema.pre('insertMany', function(next, docs) {
    if (Array.isArray(docs)) {
        docs.forEach(doc => {
            if (!doc.slug) {
                doc.slug = slugify(doc.name, {
                    lower: true,
                    strict: true,
                    remove: /[*+~.()'"!:@]/g
                });
            }
        });
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);


