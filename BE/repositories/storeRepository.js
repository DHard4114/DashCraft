const User = require('../models/userModel');
const Store = require('../models/storeModel');
const Item = require('../models/itemModel');


async function createStore(req, res) {
    try {
        const { name, description, owner } = req.body;

        const ownerUser = await User.findById(owner);
        if (!ownerUser) {
            return res.status(400).json({ success: false, message: "Owner not found" });
        }

        const store = new Store({
            name,
            description,
            owner,
        });

        await store.save();
        res.status(200).json({ success: true, message: "Store created", data: store });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getAllStores(req, res) {
    try {
        const stores = await Store.find().populate("owner", "username").populate("items", "name");
        res.status(200).json({ success: true, data: stores });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getStoreById(req, res) {
    try {
        const { storeId } = req.params;
        const store = await Store.findById(storeId).populate("owner", "username").populate("items", "name description price quantity");
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }
        res.status(200).json({ success: true, data: store });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateStore(req, res) {
    try {
        const { storeId } = req.params;
        const { name, description } = req.body;

        const store = await Store.findByIdAndUpdate(storeId, { name, description }, { new: true });
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        res.status(200).json({ success: true, data: store });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteStore(req, res) {
    try {
        const { storeId } = req.params;

        const store = await Store.findByIdAndDelete(storeId);
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        await Item.updateMany({ store: storeId }, { $unset: { store: "" } });

        res.status(200).json({ success: true, message: "Store deleted" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore
};
