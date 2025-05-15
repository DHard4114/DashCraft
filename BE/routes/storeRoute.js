const express = require('express');
const storeRepo = require('../repositories/storeRepository');
const router = express.Router();

router.get('/', storeRepo.getAllStores);

router.post('/create', storeRepo.createStore);

router.get('/:storeId', storeRepo.getStoreById);

router.put('/:storeId', storeRepo.updateStore);

router.delete('/:storeId', storeRepo.deleteStore);

module.exports = router;
