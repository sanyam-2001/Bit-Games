import express from 'express';
import http from 'http';
import GlobalRoutes from './routes/GlobalRoutes.js';

export const app = express();  // Initialize express app
export const server = http.createServer(app); // Create HTTP server with Express


// Define PORT
const PORT = process.env.PORT || 5000;

app.use('/', GlobalRoutes);

if (process.env.ENVIRONMENT === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}
// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 