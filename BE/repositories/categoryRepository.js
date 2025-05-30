const Category = require('../models/categoryModel');
const ApiError = require('../utils/errorApi');

class CategoryRepository {
    static async getAllCategories(req, res) {
        try {
            const { theme, material } = req.query;
            const filters = { status: 'active' };
            
            if (theme) filters.theme = theme;
            if (material) {
                filters['materials.name'] = { $regex: material, $options: 'i' };
            }

            const categories = await Category.find(filters)
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getCategoryBySlug(req, res) {
        try {
            const category = await Category.findOne({ 
                slug: req.params.slug,
                status: 'active'
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getCategoryById(req, res) {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getCategoryMaterials(req, res) {
        try {
            const category = await Category.findOne({ 
                slug: req.params.slug,
                status: 'active'
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                data: {
                    category: category.name,
                    theme: category.theme,
                    materials: category.materials
                }
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getAllMaterials(req, res) {
        try {
            const { sustainability, category } = req.query;
            const filters = { status: 'active' };
            
            if (category) filters.code = category;

            const categories = await Category.find(filters);
            
            let allMaterials = categories.reduce((materials, cat) => {
                cat.materials.forEach(material => {
                    materials.push({
                        ...material.toObject(),
                        category: cat.name,
                        categoryCode: cat.code,
                        categorySlug: cat.slug,
                        theme: cat.theme
                    });
                });
                return materials;
            }, []);

            // Filter by sustainability if specified
            if (sustainability) {
                allMaterials = allMaterials.filter(material => 
                    material.sustainability === sustainability
                );
            }

            res.status(200).json({
                success: true,
                count: allMaterials.length,
                data: allMaterials
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async createCategory(req, res) {
        try {
            const { 
                name, 
                code, 
                description, 
                icon, 
                theme, 
                materials 
            } = req.body;

            const category = await Category.create({
                name,
                code: code.toUpperCase(),
                description,
                icon,
                theme,
                materials: materials || []
            });

            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async updateCategory(req, res) {
        try {
            const { 
                name, 
                code, 
                description, 
                icon, 
                theme, 
                materials, 
                status 
            } = req.body;

            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { 
                    name, 
                    code: code?.toUpperCase(), 
                    description, 
                    icon, 
                    theme, 
                    materials, 
                    status 
                },
                { new: true, runValidators: true }
            );

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                data: category,
                message: 'Category updated successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async addMaterialToCategory(req, res) {
        try {
            const { name, description, properties, uses, sustainability } = req.body;
            
            const category = await Category.findById(req.params.id);
            
            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            const newMaterial = {
                name,
                description,
                properties: properties || [],
                uses: uses || [],
                sustainability: sustainability || 'medium'
            };

            category.materials.push(newMaterial);
            await category.save();

            res.status(200).json({
                success: true,
                data: category,
                message: 'Material added to category successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async removeMaterialFromCategory(req, res) {
        try {
            const { categoryId, materialId } = req.params;
            
            const category = await Category.findById(categoryId);
            
            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            category.materials.id(materialId).remove();
            await category.save();

            res.status(200).json({
                success: true,
                data: category,
                message: 'Material removed from category successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = CategoryRepository;