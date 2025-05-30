const express = require('express');
const router = express.Router();
const CategoryRepository = require('../repositories/categoryRepository');
const { authMiddleware } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Public routes
router.get('/', CategoryRepository.getAllCategories);
router.get('/materials', CategoryRepository.getAllMaterials);
router.get('/:slug', CategoryRepository.getCategoryBySlug);
router.get('/:slug/materials', CategoryRepository.getCategoryMaterials);
router.get('/id/:id', CategoryRepository.getCategoryById);

// Protected routes (require authentication)
router.use(authMiddleware);

// Admin only routes
router.post('/', authorizeRoles('admin'), CategoryRepository.createCategory);
router.put('/:id', authorizeRoles('admin'), CategoryRepository.updateCategory);
router.delete('/:id', authorizeRoles('admin'), CategoryRepository.deleteCategory);

// Material management routes
router.post('/:id/materials', authorizeRoles('admin'), CategoryRepository.addMaterialToCategory);
router.delete('/:categoryId/materials/:materialId', authorizeRoles('admin'), CategoryRepository.removeMaterialFromCategory);

module.exports = router;