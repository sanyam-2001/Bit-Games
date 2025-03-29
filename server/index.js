import express from 'express';
import http from 'http';
import GlobalRoutes from './routes/GlobalRoutes.js';

export const app = express();  // Initialize express app
export const server = http.createServer(app); // Create HTTP server with Express


// Define PORT
const PORT = process.env.PORT || 5000;

app.use('/', GlobalRoutes);

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 