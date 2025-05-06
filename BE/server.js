const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/itemRoute');
const transactionRoutes = require('./routes/transactionRoute');
const storeRoutes = require('./routes/storeRoute');

const errorHandler = require('./middleware/errorMiddleware');
const corsMiddleware = require('./middleware/corsMiddleware');

const { connectDB } = require('./config/db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);

connectDB();

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/stores", storeRoutes);
app.use("/transactions", transactionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});