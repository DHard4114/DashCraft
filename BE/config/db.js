const mongoose = require('mongoose');

exports.connectDB = async function () {
    const URI = process.env.MONGODB_URI;
    const connectionParams = {};

    mongoose.set('strictQuery', false);
    mongoose.set('strictPopulate', false);

    mongoose
        .connect(URI, connectionParams)
        .then(() => console.info('MongoDB connection established'))
        .catch((err) => console.error('MongoDB connection error: ' + err.message));
};
