const express = require("express");
const router = express.Router();
const itemRepo = require("../repositories/itemRepository");
const upload = require("../utils/multer");

// All routes are public
router.get("/", itemRepo.getAllItems);
router.get("/:id", itemRepo.getItemById);
router.post("/", upload.single("image"), itemRepo.addItem);
router.put("/:id", upload.single("image"), itemRepo.updateItem);
router.delete("/:id", itemRepo.deleteItem);

module.exports = router;