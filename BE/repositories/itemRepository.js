const Item = require("../models/itemModel");
const Store = require("../models/storeModel");

async function getAllItems(req, res) {
    try {
        const items = await Item.find()
            .populate("store", "name")  // Jika ingin menampilkan nama store yang terkait dengan item
            .sort({ createdAt: -1 });  // Menampilkan item terbaru terlebih dahulu

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

// Add an item to a store
async function addItemToStore(req, res) {
    try {
        // Cek dulu req.body nya ada isinya atau tidak
        console.log('REQ BODY:', req.body);
        console.log('REQ FILE:', req.file);

        // Ambil data dari form-data
        const { name, description, price, quantity, store } = req.body;

        // Validasi basic
        if (!name || !description || !price || !quantity || !store) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validasi angka
        if (price <= 0 || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Price and quantity must be greater than 0" });
        }

        // Cek apakah store ada
        const storeExist = await Store.findById(store);
        if (!storeExist) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }

        // Pastikan file ada
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Dapatkan URL gambar dari Cloudinary upload
        const imageUrl = req.file.path;

        // Buat item baru
        const item = new Item({
            name,
            description,
            price,
            quantity,
            imageUrl, // simpan url gambar
            store,
        });

        // Simpan item
        await item.save();

        // Tambahkan item ke list items di store
        storeExist.items.push(item._id);
        await storeExist.save();

        res.status(200).json({ success: true, message: "Item added to store", data: item });
    } catch (err) {
        console.error("Error while adding item: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

// Get all items from a store
async function getItemsByStore(req, res) {
    try {
        const { storeId } = req.params;
        const store = await Store.findById(storeId).populate("items", "name price quantity");
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        res.status(200).json({ success: true, data: store.items });
    } catch (err) {
        console.error("Error while get item by store: ", err);
        res.status(400).json({ success: false, message: err.message });
    }
}

// Get a specific item by ID
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

// Fungsi updateItem yang diperbarui
const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        // Find existing item
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Optional: if new image is uploaded
        if (req.file) {
            item.imageUrl = req.file.path;
        }

        // Update fields (only if provided)
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

        // If storeId is provided, validate and update store
        if (req.body.storeId) {
            const store = await Store.findById(req.body.storeId);
            if (!store) {
                return res.status(400).json({ success: false, message: "Store not found" });
            }
            item.store = req.body.storeId;
        }

        // Save perubahan
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

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Remove the item from the store's item list
        const store = await Store.findById(item.store);
        store.items.pull(itemId);
        await store.save();

        // Delete the item
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
