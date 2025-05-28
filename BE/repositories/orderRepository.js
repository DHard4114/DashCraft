const Order = require('../models/orderModel');
const Cart = require('../models/cartModels');

class OrderRepository {
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            await order.save();
            return { success: true, data: order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async createFromCart(cartId, orderData) {
        try {
            const cart = await Cart.findById(cartId)
                .populate('items.item');
            
            if (!cart) {
                return { success: false, message: 'Cart not found' };
            }

            const orderItems = cart.items.map(item => ({
                item: item.item._id,
                name: item.item.name,
                sku: item.item.sku,
                quantity: item.quantity,
                price: item.priceAtAddition,
                finalPrice: item.priceAtAddition
            }));

            const order = new Order({
                customer: cart.customer,
                items: orderItems,
                shippingAddress: orderData.shippingAddress,
                shippingMethod: orderData.shippingMethod,
                pricing: {
                    subtotal: cart.subtotal,
                    discountAmount: cart.discountAmount,
                    shippingCost: orderData.shippingCost,
                    tax: orderData.tax,
                    total: cart.totalAmount + orderData.shippingCost + orderData.tax
                },
                coupon: cart.coupon,
                appliedDiscount: cart.appliedDiscount
            });

            await order.save();
            
            // Update cart status
            cart.status = 'ordered';
            await cart.save();

            return { success: true, data: order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async getOrderById(id) {
        try {
            const order = await Order.findById(id)
                .populate('customer', 'username email')
                .populate('items.item');
            return { success: true, data: order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async updateOrderStatus(orderId, status, note, userId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return { success: false, message: 'Order not found' };
            }

            await order.addTimelineEvent(status, note, userId);
            return { success: true, data: order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async getCustomerOrders(customerId, filters = {}) {
        try {
            const orders = await Order.find({ 
                customer: customerId,
                ...filters 
            })
            .populate('items.item')
            .sort({ createdAt: -1 });
            return { success: true, data: orders };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = new OrderRepository();
