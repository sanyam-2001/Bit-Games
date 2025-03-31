import { Server } from 'socket.io';
import { timelog } from '../utils/LoggingUtils.js';
import { handleJoinLobby, handleCreateLobby } from '../handlers/roomHandlers.js';

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

        // Handle And Create room
        socket.on('joinLobby', (data) => handleJoinLobby(socket, data));
        socket.on('createLobby', (data) => handleCreateLobby(socket, data));


        socket.on('disconnect', () => {
            timelog(`Client disconnected: ${socket.id}`);
        });
    });
}