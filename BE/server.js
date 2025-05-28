require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');

const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/itemRoute');
const cartRoutes = require('./routes/cartRoute');
const orderRoutes = require('./routes/orderRoute');
const paymentRoutes = require('./routes/paymentRoute');
const categoryRoutes = require('./routes/categoryRoute');

const errorHandler = require('./middleware/errorMiddleware');
const corsMiddleware = require('./middleware/corsMiddleware');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Database connection
connectDB();

// Routes - all public now
app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/category", categoryRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});