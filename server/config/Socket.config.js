import { Server } from 'socket.io';
import { timelog } from '../utils/LoggingUtils.js';
import { registerLobbyHandlers } from '../handlers/lobbyHandler.js';
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
        registerLobbyHandlers(io, socket);

        socket.on('disconnect', () => {
            timelog(`Client disconnected: ${socket.id}`);
        });
    });
}