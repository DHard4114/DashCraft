const Category = require('../models/categoryModel');

class CategoryRepository {
    async getAll() {
        try {
            const categories = await Category.find().sort('name');
            return { success: true, data: categories };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async getById(id) {
        try {
            const category = await Category.findById(id);
            if (!category) {
                return { success: false, message: 'Category not found' };
            }
            return { success: true, data: category };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async create(data) {
        try {
            const category = await category.save();
            return { success: true, data: category };
        } catch (err) {
            if (err.code === 11000) {
                return { success: false, message: 'Category name must be unique' };
            }
            return { success: false, message: err.message };
        }
    }

    async update(id, data) {
        try {
            const category = await Category.findByIdAndUpdate(
                id,
                {
                    name: data.name,
                    description: data.description,
                    isActive: data.isActive
                },
                { new: true, runValidators: true }
            );
            if (!category) {
                return { success: false, message: 'Category not found' };
            }
            return { success: true, data: category };
        } catch (err) {
            if (err.code === 11000) {
                return { success: false, message: 'Category name must be unique' };
            }
            return { success: false, message: err.message };
        }
    }

    async delete(id) {
        try {
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                return { success: false, message: 'Category not found' };
            }
            return { success: true, message: 'Category deleted successfully' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = new CategoryRepository();
