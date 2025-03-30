import express from 'express';
import http from 'http';
import GlobalRoutes from './routes/GlobalRoutes.js';
import path from 'path';
import { setupSocketHandlers } from './config/Socket.config.js';

const app = express();  // Initialize express app
const server = http.createServer(app);

setupSocketHandlers(server);

// Define PORT
const PORT = process.env.PORT || 5000;

// Routes
app.use('/', GlobalRoutes);

if (process.env.ENVIRONMENT === 'PROD') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 