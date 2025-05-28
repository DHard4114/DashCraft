const Payment = require('../models/paymentModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

class PaymentRepository {
    async processPayment(customerId, paymentMethod) {
        try {
            const cart = await Cart.findOne({ 
                customer: customerId,
                status: 'active' 
            }).populate('items.item');

            if (!cart) return { success: false, message: 'Cart not found' };

            // Create order
            const order = new Order({
                customer: customerId,
                items: cart.items,
                total: cart.total,
                status: 'pending'
            });
            await order.save();

            // Create payment
            const payment = new Payment({
                orderId: order._id,
                customerId,
                amount: cart.total,
                paymentMethod,
                status: 'pending'
            });
            await payment.save();

            // Update cart status
            cart.status = 'completed';
            await cart.save();

            return { success: true, data: { payment, order } };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async updatePaymentStatus(paymentId, status) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) return { success: false, message: 'Payment not found' };

            payment.status = status;
            payment.paymentDate = new Date();
            await payment.save();

            if (status === 'completed') {
                await Order.findByIdAndUpdate(payment.orderId, { status: 'confirmed' });
            }

            return { success: true, data: payment };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async getPaymentsByCustomer(customerId) {
        try {
            const payments = await Payment.find({ customerId })
                .populate('orderId')
                .sort({ createdAt: -1 });
            return { success: true, data: payments };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = new PaymentRepository();