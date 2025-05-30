require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');

const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/itemRoute');
const categoryRoutes = require('./routes/categoryRoute');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const errorHandler = require('./middleware/errorMiddleware');
const corsMiddleware = require('./middleware/corsMiddleware');

const { cloudinary } = require('./utils/cloudinary');

// Test Cloudinary connection
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('❌ Cloudinary connection failed:', error);
    } else {
        console.log('✅ Cloudinary connected successfully:', result);
    }
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Database connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
