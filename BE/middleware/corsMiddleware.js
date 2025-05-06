const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:5173',''], // Daftar origin yang diperbolehkan
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Daftar methods yang diperbolehkan
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
