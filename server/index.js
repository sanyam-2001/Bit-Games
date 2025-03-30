import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import GlobalRoutes from './routes/GlobalRoutes.js';
import path from 'path';

export const app = express();  // Initialize express app
export const server = http.createServer(app); // Create HTTP server with Express
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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