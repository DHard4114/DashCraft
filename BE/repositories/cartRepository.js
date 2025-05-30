const Cart = require('../models/cartModel');
const Item = require('../models/itemModel');
const ApiError = require('../utils/errorApi');

class CartRepository {
    // Get user's cart
    static async getUserCart(req, res) {
        try {
            let cart = await Cart.findOne({ user: req.user.id })
                .populate({
                    path: 'items.item',
                    select: 'name slug price images status',
                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                });

            if (!cart) {
                cart = await Cart.create({ user: req.user.id });
            }

            // Filter out inactive items
            const activeItems = cart.items.filter(cartItem => 
                cartItem.item && cartItem.item.status === 'active'
            );

            if (activeItems.length !== cart.items.length) {
                cart.items = activeItems;
                await cart.save();
            }

            res.status(200).json({
                success: true,
                data: cart,
                message: 'Cart retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Add item to cart
    static async addItemToCart(req, res) {
        try {
            const { itemId, quantity = 1 } = req.body;

            // Validate item exists and is active
            const item = await Item.findById(itemId);
            if (!item) {
                throw new ApiError(404, 'Item not found');
            }

            if (item.status !== 'active') {
                throw new ApiError(400, 'Item is not available');
            }

            // Find or create cart
            let cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                cart = await Cart.create({ user: req.user.id });
            }

            // Add item to cart
            await cart.addItem({
                item: itemId,
                quantity: parseInt(quantity),
                price: item.price
            });

            // Populate cart for response
            await cart.populate({
                path: 'items.item',
                select: 'name slug price images'
            });

            res.status(200).json({
                success: true,
                data: cart,
                message: 'Item added to cart successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update item quantity in cart
    static async updateCartItemQuantity(req, res) {
        try {
            const { quantity } = req.body;
            const { itemId } = req.params;

            if (!quantity || quantity < 0) {
                throw new ApiError(400, 'Please provide a valid quantity');
            }

            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                throw new ApiError(404, 'Cart not found');
            }

            await cart.updateItemQuantity(itemId, parseInt(quantity));

            await cart.populate({
                path: 'items.item',
                select: 'name slug price images'
            });

            res.status(200).json({
                success: true,
                data: cart,
                message: 'Cart updated successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Remove item from cart
    static async removeItemFromCart(req, res) {
        try {
            const { itemId } = req.params;

            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                throw new ApiError(404, 'Cart not found');
            }

            await cart.removeItem(itemId);

            await cart.populate({
                path: 'items.item',
                select: 'name slug price images'
            });

            res.status(200).json({
                success: true,
                data: cart,
                message: 'Item removed from cart successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Clear entire cart
    static async clearUserCart(req, res) {
        try {
            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                throw new ApiError(404, 'Cart not found');
            }

            await cart.clearCart();

            res.status(200).json({
                success: true,
                data: cart,
                message: 'Cart cleared successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get cart summary
    static async getCartSummary(req, res) {
        try {
            const cart = await Cart.findOne({ user: req.user.id });

            const summary = {
                totalItems: cart ? cart.totalItems : 0,
                totalAmount: cart ? cart.totalAmount : 0,
                itemCount: cart ? cart.items.length : 0
            };

            res.status(200).json({
                success: true,
                data: summary,
                message: 'Cart summary retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Sync cart with latest item prices
    static async syncCartPrices(req, res) {
        try {
            const cart = await Cart.findOne({ user: req.user.id });
            if (!cart) {
                throw new ApiError(404, 'Cart not found');
            }

            let hasChanges = false;

            // Check each item for price changes
            for (let cartItem of cart.items) {
                const currentItem = await Item.findById(cartItem.item);
                
                if (!currentItem || currentItem.status !== 'active') {
                    // Remove inactive items
                    cart.items = cart.items.filter(item => 
                        item.item.toString() !== cartItem.item.toString()
                    );
                    hasChanges = true;
                } else if (currentItem.price !== cartItem.price) {
                    // Update price
                    cartItem.price = currentItem.price;
                    cartItem.subtotal = cartItem.quantity * currentItem.price;
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                await cart.save();
            }

            await cart.populate({
                path: 'items.item',
                select: 'name slug price images'
            });

            res.status(200).json({
                success: true,
                data: { 
                    cart,
                    hasChanges
                },
                message: hasChanges ? 'Cart synced with latest prices' : 'Cart is up to date'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Check if item exists in cart
    static async isItemInCart(req, res) {
        try {
            const { itemId } = req.params;
            
            const cart = await Cart.findOne({ 
                user: req.user.id,
                'items.item': itemId 
            });

            res.status(200).json({
                success: true,
                data: { isInCart: !!cart },
                message: 'Item check completed'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get cart item count for user
    static async getCartItemCount(req, res) {
        try {
            const cart = await Cart.findOne({ user: req.user.id });
            const count = cart ? cart.totalItems : 0;

            res.status(200).json({
                success: true,
                data: { count },
                message: 'Cart item count retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = CartRepository;