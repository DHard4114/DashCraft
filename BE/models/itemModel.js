const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: ['Mudah', 'Sedang', 'Sulit', 'Easy', 'Medium', 'Hard']
    },
    estimatedTime: {
        type: String,
        required: [true, 'Estimated time is required']
    },
    materials: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        notes: String
    }],
    instructions: [{
        step: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    tags: [String],
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        },
        list: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            review: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }
}, {
    timestamps: true
});

// Create indexes using schema.index() only
itemSchema.index({ slug: 1 }, { unique: true });
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ difficulty: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdBy: 1 });
itemSchema.index({ 'ratings.average': -1 });
itemSchema.index({ createdAt: -1 });

// Generate slug before saving
itemSchema.pre('save', function(next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

// Add pre-insertMany hook for bulk operations
itemSchema.pre('insertMany', function(next, docs) {
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

// Method to add rating
itemSchema.methods.addRating = function(userId, rating, review) {
    // Check if user already rated
    const existingRatingIndex = this.ratings.list.findIndex(
        r => r.user.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
        // Update existing rating
        this.ratings.list[existingRatingIndex].rating = rating;
        this.ratings.list[existingRatingIndex].review = review;
    } else {
        // Add new rating
        this.ratings.list.push({
            user: userId,
            rating,
            review
        });
    }

    // Recalculate average
    const totalRating = this.ratings.list.reduce((sum, r) => sum + r.rating, 0);
    this.ratings.count = this.ratings.list.length;
    this.ratings.average = totalRating / this.ratings.count;

    return this.save();
};

module.exports = mongoose.model('Item', itemSchema);