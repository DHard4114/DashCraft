const Item = require("../models/itemModel");
const Store = require("../models/storeModel");

async function getAllItems(req, res) {
    try {
        const items = await Item.find()
            .populate("store", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Items retrieved successfully",
            data: items
        });
    } catch (err) {
        console.error("Error while fetching all items: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function addItemToStore(req, res) {
    try {

        console.log('REQ BODY:', req.body);
        console.log('REQ FILE:', req.file);


        const { name, description, price, quantity, store } = req.body;

        if (!name || !description || !price || !quantity || !store) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (price <= 0 || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Price and quantity must be greater than 0" });
        }

        const storeExist = await Store.findById(store);
        if (!storeExist) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUrl = req.file.path;

        const item = new Item({
            name,
            description,
            price,
            quantity,
            imageUrl,
            store,
        });

        await item.save();

        storeExist.items.push(item._id);
        await storeExist.save();

        res.status(200).json({ success: true, message: "Item added to store", data: item });
    } catch (err) {
        console.error("Error while adding item: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getItemsByStore(req, res) {
    try {
        const { storeId } = req.params;
        const store = await Store.findById(storeId).populate("items", "name price quantity imageUrl");
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        res.status(200).json({ success: true, data: store.items });
    } catch (err) {
        console.error("Error while get item by store: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getItemById(req, res) {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: item });
    } catch (err) {
        console.error("Error while get item by id: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (req.file) {
            item.imageUrl = req.file.path;
        }

        if (req.body.name) {
            item.name = req.body.name;
        }
        
        if (req.body.description) {
            item.description = req.body.description;
        }
        
        if (req.body.price) {
            item.price = req.body.price;
        }
        
        if (req.body.quantity) {
            item.quantity = req.body.quantity;
        }

        if (req.body.storeId) {
            const store = await Store.findById(req.body.storeId);
            if (!store) {
                return res.status(400).json({ success: false, message: "Store not found" });
            }
            item.store = req.body.storeId;
        }

        const updatedItem = await item.save();

        res.status(200).json({ success: true, message: "Item updated", data: updatedItem });
    } catch (err) {
        console.error("Error while update item: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
};

async function deleteItem(req, res) {
    try {
        const { itemId } = req.params;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const store = await Store.findById(item.store);
        store.items.pull(itemId);
        await store.save();

        await Item.findByIdAndDelete(itemId);

        res.status(200).json({ success: true, message: "Item deleted" });
    } catch (err) {
        console.error("Error while delete item: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    addItemToStore,
    getItemsByStore,
    getItemById,
    updateItem,
    deleteItem,
    getAllItems
};
