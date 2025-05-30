const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:5173', process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
