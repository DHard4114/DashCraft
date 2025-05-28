const express = require('express');
const router = express.Router();
const cartRepo = require('../repositories/cartRepository');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const result = await cartRepo.getCart(req.user.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post('/items', async (req, res) => {
  const result = await cartRepo.addItem(req.user.id, req.body.itemId, req.body.quantity);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

router.put('/items/:itemId', async (req, res) => {
  const result = await cartRepo.updateQuantity(req.user.id, req.params.itemId, req.body.quantity);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

router.delete('/items/:itemId', async (req, res) => {
  const result = await cartRepo.removeItem(req.user.id, req.params.itemId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

module.exports = router;