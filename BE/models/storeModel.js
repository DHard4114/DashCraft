const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    }],
}, { timestamps: true });

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
