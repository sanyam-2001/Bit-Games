import { Server } from 'socket.io';
import { timelog } from '../utils/LoggingUtils.js';
import { registerLobbyHandlers } from '../handlers/lobbyHandler.js';
import { registerChatHandlers } from '../handlers/chatHandler.js';
import { SocketEvents } from '../enums/SocketEvents.enum.js';
import redisService from '../services/Redis.service.js';
import SocketPayload from '../Models/SocketPayload.model.js';
import { registerVoiceHandlers } from '../handlers/voiceHandlers.js';

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
        registerChatHandlers(io, socket);
        registerVoiceHandlers(io, socket);

        socket.on('disconnect', async () => {
            const response = await redisService.get(`SOCKET:${socket.id}`);
            if (!response) {
                timelog(`Client disconnection Error[No Socket Lobby Pair Found]: ${socket.id}`);
                return;
            }
            const { lobbyId, playerId: leavingPlayersId } = response;

            const lobby = await redisService.get(`LOBBY:${lobbyId}`);
            lobby.players = lobby.players.filter(player => player.id !== leavingPlayersId);
            if (lobby.players.length > 0 && lobby.admin === leavingPlayersId) {
                lobby.admin = lobby.players[0].id;
            }
            await redisService.delete(`SOCKET:${socket.id}`);
            await redisService.set(`LOBBY:${lobbyId}`, lobby);

            io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATED, new SocketPayload(true, null, { lobby }));
            timelog(`Client disconnected: ${socket.id}`);
        });
    });
}