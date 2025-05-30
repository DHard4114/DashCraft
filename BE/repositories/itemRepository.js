// filepath: c:\Users\dapah\Documents\KULIAH\SEMESTER 4\SISTEM BASIS DATA\Kelas\DashCraft\BE\repositories\itemRepository.js
const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
const { cloudinary } = require('../utils/cloudinary');
const ApiError = require('../utils/errorApi');

class ItemRepository {
    static async createItem(req, res) {
        try {
            console.log('Request body:', req.body);
            console.log('Request files:', req.files);
            
            // Parse JSON data from form-data
            let itemData;
            
            if (req.body.data) {
                itemData = JSON.parse(req.body.data);
            } else {
                itemData = {
                    name: req.body.name,
                    description: req.body.description,
                    price: Number(req.body.price),
                    category: req.body.category,
                    difficulty: req.body.difficulty,
                    estimatedTime: req.body.estimatedTime,
                    materials: JSON.parse(req.body.materials || '[]'),
                    instructions: JSON.parse(req.body.instructions || '[]'),
                    tags: req.body.tags ? req.body.tags.split(',') : [],
                    status: req.body.status || 'active'
                };
            }

            // Validate category exists
            const categoryExists = await Category.findById(itemData.category);
            if (!categoryExists) {
                throw new ApiError(400, 'Invalid category ID');
            }

            // Add creator ID
            itemData.createdBy = req.user.id;

            // Handle image uploads - files are already uploaded to Cloudinary via multer
            if (req.files && req.files.length > 0) {
                itemData.images = req.files.map((file, index) => ({
                    url: file.path, // Cloudinary URL
                    publicId: file.filename, // Cloudinary public ID
                    isPrimary: index === 0
                }));
            } else {
                itemData.images = [];
            }

            console.log('Creating item with data:', itemData);

            const item = await Item.create(itemData);
            
            // Update category item count
            await Category.findByIdAndUpdate(
                itemData.category,
                { $inc: { itemCount: 1 } }
            );

            // Populate category data in response
            const populatedItem = await Item.findById(item._id)
                .populate('category', 'name code theme description icon')
                .populate('createdBy', 'username email');

            res.status(201).json({
                success: true,
                data: populatedItem,
                message: 'Item created successfully'
            });
        } catch (error) {
            console.error('Create item error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async updateItem(req, res) {
        try {
            // Parse JSON data from form-data
            let updateData;
            
            if (req.body.data) {
                updateData = JSON.parse(req.body.data);
            } else {
                updateData = {
                    name: req.body.name,
                    description: req.body.description,
                    price: Number(req.body.price),
                    category: req.body.category,
                    difficulty: req.body.difficulty,
                    estimatedTime: req.body.estimatedTime,
                    materials: JSON.parse(req.body.materials || '[]'),
                    instructions: JSON.parse(req.body.instructions || '[]'),
                    tags: req.body.tags ? req.body.tags.split(',') : [],
                    status: req.body.status
                };
            }

            // Get current item to check category change
            const currentItem = await Item.findOne({ 
                _id: req.params.id, 
                createdBy: req.user.id 
            });

            if (!currentItem) {
                throw new ApiError(404, 'Item not found or unauthorized');
            }

            // Validate new category if changed
            if (updateData.category && updateData.category !== currentItem.category.toString()) {
                const categoryExists = await Category.findById(updateData.category);
                if (!categoryExists) {
                    throw new ApiError(400, 'Invalid category ID');
                }

                // Update category item counts
                await Category.findByIdAndUpdate(
                    currentItem.category,
                    { $inc: { itemCount: -1 } }
                );
                await Category.findByIdAndUpdate(
                    updateData.category,
                    { $inc: { itemCount: 1 } }
                );
            }

            // Handle new image uploads
            if (req.files && req.files.length > 0) {
                // Delete old images from Cloudinary
                if (currentItem.images && currentItem.images.length > 0) {
                    await Promise.all(currentItem.images.map(img => 
                        cloudinary.uploader.destroy(img.publicId)
                    ));
                }

                updateData.images = req.files.map((file, index) => ({
                    url: file.path,
                    publicId: file.filename,
                    isPrimary: index === 0
                }));
            }

            const item = await Item.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.user.id },
                updateData,
                { new: true, runValidators: true }
            ).populate('category', 'name code theme description icon')
             .populate('createdBy', 'username email');

            res.status(200).json({
                success: true,
                data: item,
                message: 'Item updated successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getAllItems(req, res) {
        try {
            const { 
                category, 
                difficulty, 
                search, 
                theme, 
                minPrice, 
                maxPrice,
                sortBy,
                page = 1,
                limit = 10
            } = req.query;

            const filters = { status: 'active' };
            
            // Category filter (by ID or code)
            if (category) {
                if (category.length === 24) {
                    // ObjectId
                    filters.category = category;
                } else {
                    // Category code
                    const categoryDoc = await Category.findOne({ code: category });
                    if (categoryDoc) {
                        filters.category = categoryDoc._id;
                    }
                }
            }

            // Theme filter
            if (theme) {
                const categoryDocs = await Category.find({ theme });
                const categoryIds = categoryDocs.map(cat => cat._id);
                filters.category = { $in: categoryIds };
            }

            // Other filters
            if (difficulty) filters.difficulty = difficulty;
            if (search) {
                filters.$text = { $search: search };
            }
            if (minPrice || maxPrice) {
                filters.price = {};
                if (minPrice) filters.price.$gte = Number(minPrice);
                if (maxPrice) filters.price.$lte = Number(maxPrice);
            }

            // Sorting
            let sortOptions = { createdAt: -1 };
            if (sortBy === 'price-asc') sortOptions = { price: 1 };
            if (sortBy === 'price-desc') sortOptions = { price: -1 };
            if (sortBy === 'rating') sortOptions = { 'ratings.average': -1 };
            if (sortBy === 'name') sortOptions = { name: 1 };

            // Pagination
            const skip = (Number(page) - 1) * Number(limit);

            const items = await Item.find(filters)
                .populate('category', 'name code theme description icon materials')
                .populate('createdBy', 'username email')
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit));

            const total = await Item.countDocuments(filters);

            res.status(200).json({
                success: true,
                count: items.length,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: items
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getItemBySlug(req, res) {
        try {
            const item = await Item.findOne({ slug: req.params.slug })
                .populate('category', 'name code theme description icon materials')
                .populate('createdBy', 'username email profile')
                .populate({
                    path: 'ratings.list.user',
                    select: 'username profile.firstName profile.lastName'
                });

            if (!item) {
                throw new ApiError(404, 'Item not found');
            }

            res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getItemsByCategory(req, res) {
        try {
            const { categorySlug } = req.params;
            const { page = 1, limit = 10, sortBy } = req.query;

            // Find category by slug
            const category = await Category.findOne({ 
                slug: categorySlug,
                status: 'active'
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            // Sorting
            let sortOptions = { createdAt: -1 };
            if (sortBy === 'price-asc') sortOptions = { price: 1 };
            if (sortBy === 'price-desc') sortOptions = { price: -1 };
            if (sortBy === 'rating') sortOptions = { 'ratings.average': -1 };

            // Pagination
            const skip = (Number(page) - 1) * Number(limit);

            const items = await Item.find({ 
                category: category._id,
                status: 'active'
            })
                .populate('category', 'name code theme description icon')
                .populate('createdBy', 'username email')
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit));

            const total = await Item.countDocuments({ 
                category: category._id,
                status: 'active'
            });

            res.status(200).json({
                success: true,
                category: {
                    name: category.name,
                    code: category.code,
                    theme: category.theme,
                    description: category.description
                },
                count: items.length,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: items
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async deleteItem(req, res) {
        try {
            const item = await Item.findOne({ 
                _id: req.params.id, 
                createdBy: req.user.id 
            });

            if (!item) {
                throw new ApiError(404, 'Item not found or unauthorized');
            }

            // Delete images from Cloudinary
            if (item.images && item.images.length > 0) {
                await Promise.all(item.images.map(img => 
                    cloudinary.uploader.destroy(img.publicId)
                ));
            }

            // Update category item count
            await Category.findByIdAndUpdate(
                item.category,
                { $inc: { itemCount: -1 } }
            );

            await item.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Item deleted successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async addRating(req, res) {
        try {
            const { rating, review } = req.body;
            const { itemId } = req.params;

            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            await item.addRating(req.user.id, rating, review);

            res.status(200).json({
                success: true,
                data: {
                    average: item.ratings.average,
                    count: item.ratings.count,
                    userRating: rating
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getItemRatings(req, res) {
        try {
            const item = await Item.findById(req.params.itemId)
                .populate({
                    path: 'ratings.list.user',
                    select: 'username profile.firstName profile.lastName'
                });

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    average: item.ratings.average,
                    count: item.ratings.count,
                    ratings: item.ratings.list
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ItemRepository;