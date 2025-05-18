const express = require("express");
const itemRepo = require("../repositories/itemRepository");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", itemRepo.getAllItems);

router.post("/addItemToStore", upload.single("image"), itemRepo.addItemToStore);

router.get("/store/:storeId", itemRepo.getItemsByStore);

router.get("/:itemId", itemRepo.getItemById);

router.put("/:itemId", upload.single("image"), itemRepo.updateItem);

router.patch("/:itemId", upload.none(), itemRepo.updateItem);

router.delete("/:itemId", itemRepo.deleteItem);

module.exports = router;