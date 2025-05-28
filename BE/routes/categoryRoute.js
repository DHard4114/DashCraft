const express = require('express');
const router = express.Router();
const categoryRepo = require('../repositories/categoryRepository');

router.get('/', async (req, res) => {
    const result = await categoryRepo.getAll();
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

router.get('/:id', async (req, res) => {
    const result = await categoryRepo.getById(req.params.id);
    if (result.success) {
        res.json(result);
    } else {
        res.status(404).json(result);
    }
});

router.post('/', async (req, res) => {
    const result = await categoryRepo.create(req.body);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
});

router.put('/:id', async (req, res) => {
    const result = await categoryRepo.update(req.params.id, req.body);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

router.delete('/:id', async (req, res) => {
    const result = await categoryRepo.delete(req.params.id);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

module.exports = router;
