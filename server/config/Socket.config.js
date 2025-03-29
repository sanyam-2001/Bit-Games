import { server } from '../index.js';
import { Server } from 'socket.io';

// Initialize Socket.io with the server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
});