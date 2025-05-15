const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/itemRoute');
const transactionRoutes = require('./routes/transactionRoute');
const storeRoutes = require('./routes/storeRoute');
const paymentRoutes = require('./routes/paymentRoute');

const errorHandler = require('./middleware/errorMiddleware');
const corsMiddleware = require('./middleware/corsMiddleware');

const { connectDB } = require('./config/db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);

connectDB();

app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/store", storeRoutes);
app.use("/transaction", transactionRoutes);
app.use("/payment", paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});