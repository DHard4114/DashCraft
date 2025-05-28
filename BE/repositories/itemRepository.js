const Item = require("../models/itemModel");

class ItemRepository {
    async getAllItems() {
        try {
            const items = await Item.find()
                .populate("category", "name")
                .sort({ createdAt: -1 });
            return { success: true, data: items };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async addItem(itemData, imageUrl) {
        try {
            const item = new Item({
                ...itemData,
                imageUrl
            });
            await item.save();
            return { success: true, data: item };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async getItemById(id) {
        try {
            const item = await Item.findById(id);
            if (!item) {
                return { success: false, message: "Item not found" };
            }
            return { success: true, data: item };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async updateItem(id, updateData) {
        try {
            const item = await Item.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            });
            return { success: true, data: item };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async deleteItem(id) {
        try {
            await Item.findByIdAndDelete(id);
            return { success: true, message: "Item deleted" };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = new ItemRepository();
