const express = require("express");
const itemRepo = require("../repositories/itemRepository");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", itemRepo.getAllItems);

// Create an item and add it to a store
router.post("/addItemToStore", upload.single("image"), itemRepo.addItemToStore);

// Get all items from a store
router.get("/:storeId/items", itemRepo.getItemsByStore);

// Get a specific item by ID
router.get("/:itemId", itemRepo.getItemById);

// Update an item - tambahkan middleware upload.single("image")
router.put("/:itemId", upload.single("image"), itemRepo.updateItem);

// Update item tanpa gambar (opsional, untuk efisiensi)
router.patch("/:itemId", upload.none(), itemRepo.updateItem);

// Delete an item
router.delete("/:itemId", itemRepo.deleteItem);

module.exports = router;