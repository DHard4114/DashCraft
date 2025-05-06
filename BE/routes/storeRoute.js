const express = require('express');
const storeRepo = require('../repositories/storeRepository');
const router = express.Router();

// Get all stores
router.get('/', storeRepo.getAllStores);

// Create a new store
router.post('/create', storeRepo.createStore);

// Get store by ID
router.get('/:storeId', storeRepo.getStoreById);

// Update store
router.put('/:storeId', storeRepo.updateStore);

// Delete store
router.delete('/:storeId', storeRepo.deleteStore);

module.exports = router;
