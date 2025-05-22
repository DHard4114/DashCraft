const Cart = require('../models/cartModel');
const Item = require('../models/itemModel');

async function getAllCarts(req, res) {
    try {
        const carts = await Cart.find().populate('items.item').populate('customerId');
        res.status(200).json({ success: true, data: carts });
    } catch (err) {
        console.error('Error getting all carts:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getCartByCustomer(req, res) {
    try {
        const { customerId } = req.params;
        const cart = await Cart.findOne({ customerId }).populate('items.item');
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

async function addItemToCart(req, res) {
    try {
        const { customerId, itemId, quantity } = req.body;

        if (!itemId || !quantity) {
            return res.status(400).json({ success: false, message: 'Item ID and quantity are required' });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        let cart = await Cart.findOne({ customerId });

        const subtotal = item.price * quantity;

        if (!cart) {
            cart = new Cart({
                customerId,
                items: [{
                    item: item._id,
                    quantity,
                    priceAtAddition: item.price,
                    subtotal
                }]
            });
        } else {
            const existingItem = cart.items.find(ci => ci.item.toString() === itemId);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.subtotal = existingItem.quantity * existingItem.priceAtAddition;
            } else {
                cart.items.push({
                    item: item._id,
                    quantity,
                    priceAtAddition: item.price,
                    subtotal
                });
            }
        }

        await cart.save();

        res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

async function updateCartItem(req, res) {
    try {
        const { customerId, itemId, quantity } = req.body;

        const cart = await Cart.findOne({ customerId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const item = cart.items.find(i => i.item.toString() === itemId);
        if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

        item.quantity = quantity;
        item.subtotal = quantity * item.priceAtAddition;

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart updated', data: cart });
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

async function removeItemFromCart(req, res) {
    try {
        const { customerId, itemId } = req.body;

        const cart = await Cart.findOne({ customerId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.item.toString() !== itemId);

        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

async function clearCart(req, res) {
    try {
        const { customerId } = req.params;

        const cart = await Cart.findOneAndDelete({ customerId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    getAllCarts,
    getCartByCustomer,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart
};
