const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const ApiError = require('../utils/errorApi');

class OrderRepository {
    // Create order from cart with address options
    static async createOrderFromCart(req, res) {
        try {
            const { 
                shippingAddress, 
                useDefaultAddress = false,
                addressId,
                paymentMethod, 
                notes, 
                shippingCost = 0 
            } = req.body;

            // Validate payment method
            if (!paymentMethod) {
                throw new ApiError(400, 'Payment method is required');
            }

            if (!['bank_transfer', 'e_wallet', 'credit_card', 'cod'].includes(paymentMethod)) {
                throw new ApiError(400, 'Invalid payment method');
            }

            let finalShippingAddress = shippingAddress;

            // Handle address selection
            if (useDefaultAddress || addressId) {
                const user = await User.findById(req.user.id).select('profile username');
                
                if (!user) {
                    throw new ApiError(404, 'User not found');
                }

                console.log('User profile:', JSON.stringify(user.profile, null, 2)); // Debug log

                let selectedAddress;
                
                if (addressId) {
                    selectedAddress = user.profile.address?.id(addressId);
                    if (!selectedAddress) {
                        throw new ApiError(404, 'Selected address not found');
                    }
                } else {
                    selectedAddress = user.profile.address?.find(addr => addr.isDefault);
                    if (!selectedAddress) {
                        throw new ApiError(400, 'No default address found. Please add an address first.');
                    }
                }

                console.log('Selected address:', JSON.stringify(selectedAddress, null, 2)); // Debug log

                // Convert to shipping address format - USE state INSTEAD OF province
                finalShippingAddress = {
                    fullName: `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() || user.username,
                    phone: user.profile.phoneNumber || '',
                    address: selectedAddress.street,
                    city: selectedAddress.city,
                    province: selectedAddress.state, // Map state to province for order
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country || 'Indonesia'
                };
            }

            console.log('Final shipping address:', JSON.stringify(finalShippingAddress, null, 2)); // Debug log

            // Validate shipping address
            if (!finalShippingAddress) {
                throw new ApiError(400, 'Shipping address is required');
            }

            const requiredFields = ['fullName', 'phone', 'address', 'city', 'province', 'postalCode'];
            for (const field of requiredFields) {
                if (!finalShippingAddress[field] || finalShippingAddress[field].trim() === '') {
                    throw new ApiError(400, `Shipping address ${field} is required`);
                }
            }

            // Get user's cart
            const cart = await Cart.findOne({ user: req.user.id })
                .populate('items.item', 'name price status');

            if (!cart || cart.items.length === 0) {
                throw new ApiError(400, 'Cart is empty');
            }

            // Validate all items are still active
            const inactiveItems = cart.items.filter(cartItem => 
                !cartItem.item || cartItem.item.status !== 'active'
            );

            if (inactiveItems.length > 0) {
                throw new ApiError(400, 'Some items in cart are no longer available');
            }

            // Convert cart items to order items
            const orderItems = cart.items.map(cartItem => ({
                item: cartItem.item._id,
                name: cartItem.item.name,
                quantity: cartItem.quantity,
                price: cartItem.item.price,
                subtotal: cartItem.quantity * cartItem.item.price
            }));

            // Create order object
            const orderData = {
                user: req.user.id,
                items: orderItems,
                shippingAddress: finalShippingAddress,
                paymentMethod,
                shippingCost: parseInt(shippingCost) || 0,
                notes: notes || ''
            };

            console.log('Order data before save:', JSON.stringify(orderData, null, 2)); // Debug log

            // Create order
            const order = new Order(orderData);
            await order.save();

            // Clear cart after successful order creation
            await Cart.findByIdAndUpdate(cart._id, { items: [] });

            // Populate order for response
            await order.populate([
                { path: 'user', select: 'username email' },
                { path: 'items.item', select: 'name slug images' }
            ]);

            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully'
            });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user's orders
    static async getUserOrders(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const skip = (page - 1) * limit;

            const filter = { user: req.user.id };
            if (status) filter.status = status;

            const orders = await Order.find(filter)
                .populate('items.item', 'name slug images')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Order.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: {
                    orders,
                    pagination: {
                        current: parseInt(page),
                        pages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                },
                message: 'Orders retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get order by ID
    static async getOrderById(req, res) {
        try {
            const { orderId } = req.params;

            const order = await Order.findById(orderId)
                .populate([
                    { path: 'user', select: 'username email phone' },
                    { path: 'items.item', select: 'name slug images category' }
                ]);

            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            // Check if user owns this order (or is admin)
            if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied');
            }

            res.status(200).json({
                success: true,
                data: order,
                message: 'Order retrieved successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get order by order number
    static async getOrderByNumber(req, res) {
        try {
            const { orderNumber } = req.params;

            const order = await Order.findOne({ orderNumber })
                .populate([
                    { path: 'user', select: 'username email phone' },
                    { path: 'items.item', select: 'name slug images category' }
                ]);

            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            // Check if user owns this order (or is admin)
            if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied');
            }

            res.status(200).json({
                success: true,
                data: order,
                message: 'Order retrieved successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update order status (admin only)
    static async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status, tracking, reason } = req.body;

            // Check admin permission
            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            await order.updateStatus(status, { tracking, reason });

            await order.populate([
                { path: 'user', select: 'username email' },
                { path: 'items.item', select: 'name slug' }
            ]);

            res.status(200).json({
                success: true,
                data: order,
                message: 'Order status updated successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Add payment to order
    static async addPayment(req, res) {
        try {
            const { orderId } = req.params;
            const paymentData = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            // Check if user owns this order
            if (order.user.toString() !== req.user.id) {
                throw new ApiError(403, 'Access denied');
            }

            if (order.paymentStatus === 'paid') {
                throw new ApiError(400, 'Order already paid');
            }

            await order.addPayment(paymentData);

            res.status(200).json({
                success: true,
                data: order,
                message: 'Payment added successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Cancel order
    static async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { reason } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            // Check if user owns this order
            if (order.user.toString() !== req.user.id) {
                throw new ApiError(403, 'Access denied');
            }

            if (!order.canBeCancelled()) {
                throw new ApiError(400, 'Order cannot be cancelled');
            }

            await order.updateStatus('cancelled', { reason });

            res.status(200).json({
                success: true,
                data: order,
                message: 'Order cancelled successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all orders (admin only)
    static async getAllOrders(req, res) {
        try {
            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const { page = 1, limit = 10, status, search } = req.query;
            const skip = (page - 1) * limit;

            const filter = {};
            if (status) filter.status = status;
            if (search) {
                filter.$or = [
                    { orderNumber: { $regex: search, $options: 'i' } },
                    { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
                ];
            }

            const orders = await Order.find(filter)
                .populate([
                    { path: 'user', select: 'username email' },
                    { path: 'items.item', select: 'name slug' }
                ])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Order.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: {
                    orders,
                    pagination: {
                        current: parseInt(page),
                        pages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                },
                message: 'All orders retrieved successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get order statistics (admin only)
    static async getOrderStats(req, res) {
        try {
            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const stats = await Order.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' }
                    }
                }
            ]);

            const totalOrders = await Order.countDocuments();
            const totalRevenue = await Order.aggregate([
                { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);

            res.status(200).json({
                success: true,
                data: {
                    statusBreakdown: stats,
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0
                },
                message: 'Order statistics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Add payment method that auto-generates payment data
    static async initiatePayment(req, res) {
        try {
            const { orderId } = req.params;
            const { paymentMethod } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            if (order.user.toString() !== req.user.id) {
                throw new ApiError(403, 'Access denied');
            }

            if (order.paymentStatus === 'paid') {
                throw new ApiError(400, 'Order already paid');
            }

            let paymentData = {};

            switch (paymentMethod) {
                case 'bank_transfer':
                    paymentData = {
                        transactionId: `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                        paymentMethod: 'bank_transfer',
                        bankAccount: 'BCA - 1234567890 (DashCraft)',
                        amount: order.totalAmount,
                        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                        instructions: [
                            'Transfer ke rekening BCA 1234567890',
                            'Atas nama PT DashCraft Indonesia',
                            `Nominal: Rp ${order.totalAmount.toLocaleString()}`,
                            'Upload bukti transfer setelah pembayaran'
                        ]
                    };
                    break;

                case 'e_wallet':
                    // Integration with Gopay/OVO/Dana API
                    paymentData = await generateEWalletPayment(order);
                    break;

                case 'credit_card':
                    // Integration with Midtrans/Xendit
                    paymentData = await generateCreditCardPayment(order);
                    break;

                case 'cod':
                    paymentData = {
                        transactionId: `COD-${Date.now()}`,
                        paymentMethod: 'cod',
                        amount: order.totalAmount,
                        instructions: ['Bayar saat barang diterima']
                    };
                    break;
            }

            // Update order with payment data
            order.paymentDetails = paymentData;
            await order.save();

            res.status(200).json({
                success: true,
                data: {
                    order,
                    paymentData
                },
                message: 'Payment initiated successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Upload payment proof (for bank transfer)
    static async uploadPaymentProof(req, res) {
        try {
            const { orderId } = req.params;
            const { notes } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            if (order.user.toString() !== req.user.id) {
                throw new ApiError(403, 'Access denied');
            }

            if (order.paymentStatus === 'paid') {
                throw new ApiError(400, 'Order already paid');
            }

            let paymentProofUrl = null;

            // If file is uploaded
            if (req.file) {
                try {
                    // Upload to Cloudinary from buffer
                    const result = await uploadFromBuffer(req.file.buffer, {
                        folder: 'payment-proofs',
                        public_id: `payment-${orderId}-${Date.now()}`,
                        transformation: [
                            { quality: 'auto' },
                            { fetch_format: 'auto' }
                        ]
                    });

                    paymentProofUrl = result.secure_url;
                } catch (uploadError) {
                    throw new ApiError(400, 'Failed to upload payment proof');
                }
            }

            // Update payment details
            order.paymentDetails.paymentProof = paymentProofUrl;
            order.paymentDetails.notes = notes || '';
            order.paymentDetails.uploadedAt = new Date();
            order.paymentStatus = 'pending_verification';
            
            await order.save();

            // Populate order for response
            await order.populate([
                { path: 'user', select: 'username email' },
                { path: 'items.item', select: 'name slug images' }
            ]);

            res.status(200).json({
                success: true,
                data: {
                    order,
                    paymentProof: paymentProofUrl
                },
                message: 'Payment proof uploaded successfully'
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Verify payment (admin only)
    static async verifyPayment(req, res) {
        try {
            const { orderId } = req.params;
            const { status, notes } = req.body; // 'approved' or 'rejected'

            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            if (status === 'approved') {
                order.paymentStatus = 'paid';
                order.status = 'paid';
                order.paymentDetails.verifiedAt = new Date();
                order.paymentDetails.verifiedBy = req.user.id;
            } else {
                order.paymentStatus = 'failed';
                order.paymentDetails.rejectionReason = notes;
            }

            await order.save();

            res.status(200).json({
                success: true,
                data: order,
                message: `Payment ${status} successfully`
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get orders by payment status for admin dashboard
    static async getOrdersByPaymentStatus(req, res) {
        try {
            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const { paymentStatus = 'pending_verification' } = req.query;

            const orders = await Order.find({ paymentStatus })
                .populate([
                    { path: 'user', select: 'username email' },
                    { path: 'items.item', select: 'name' }
                ])
                .sort({ 'paymentDetails.uploadedAt': -1 });

            res.status(200).json({
                success: true,
                data: orders,
                message: `Orders with ${paymentStatus} status retrieved successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update shipping tracking
    static async updateShippingTracking(req, res) {
        try {
            const { orderId } = req.params;
            const { courier, trackingNumber, estimatedDelivery } = req.body;

            if (req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied. Admin only.');
            }

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            if (!['paid', 'processing'].includes(order.status)) {
                throw new ApiError(400, 'Order must be paid or processing to add tracking');
            }

            order.tracking = {
                courier,
                trackingNumber,
                estimatedDelivery: new Date(estimatedDelivery)
            };
            order.status = 'shipped';
            order.tracking.shippedDate = new Date();

            await order.save();

            res.status(200).json({
                success: true,
                data: order,
                message: 'Shipping tracking updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Mark order as delivered
    static async markAsDelivered(req, res) {
        try {
            const { orderId } = req.params;

            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            // User can mark their own order as delivered, or admin can do it
            if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
                throw new ApiError(403, 'Access denied');
            }

            if (order.status !== 'shipped') {
                throw new ApiError(400, 'Order must be shipped first');
            }

            order.status = 'delivered';
            order.tracking.deliveredDate = new Date();

            await order.save();

            res.status(200).json({
                success: true,
                data: order,
                message: 'Order marked as delivered successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Send order confirmation email
    static async sendOrderNotification(order, type) {
        const notifications = {
            'order_created': 'Order berhasil dibuat',
            'payment_received': 'Pembayaran diterima, pesanan sedang diproses',
            'order_shipped': `Pesanan dikirim via ${order.tracking.courier}`,
            'order_delivered': 'Pesanan telah diterima'
        };

        // Send email/SMS logic here
        console.log(`Notification: ${notifications[type]} for order ${order.orderNumber}`);
    }
}

module.exports = OrderRepository;