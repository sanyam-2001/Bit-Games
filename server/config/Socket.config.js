import { Server } from 'socket.io';
import { timelog } from '../utils/LoggingUtils.js';
// Socket.io connection handler

export const setupSocketHandlers = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        timelog(`New client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            timelog(`Client disconnected: ${socket.id}`);
        });
    });
}