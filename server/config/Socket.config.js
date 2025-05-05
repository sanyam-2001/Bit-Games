import { Server } from 'socket.io';
import { timelog } from '../utils/LoggingUtils.js';
import { registerLobbyHandlers } from '../handlers/lobbyHandler.js';
import { registerChatHandlers } from '../handlers/chatHandler.js';
import { SocketEvents } from '../enums/SocketEvents.enum.js';
import redisService from '../services/Redis.service.js';
import SocketPayload from '../Models/SocketPayload.model.js';
import { registerVoiceHandlers } from '../handlers/voiceHandlers.js';
import { registerTicTacToeHandlers } from '../handlers/tictactoeHandler.js';
import { LandGameService } from '../services/LandGame.service.js';
import { registerLandHandlers } from '../handlers/landHandlers.js';


export const setupSocketHandlers = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const landGameServiceInstance = new LandGameService();

    io.on("connection", (socket) => {
        timelog(`New client connected: ${socket.id}`);

        // Handle And Create room
        registerLobbyHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerVoiceHandlers(io, socket);
        registerTicTacToeHandlers(io, socket);
        registerLandHandlers(io, socket, landGameServiceInstance);

        socket.on("disconnect", async () => {
            const response = await redisService.get(`SOCKET:${socket.id}`);
            if (!response) {
                timelog(
                    `Client disconnection Error[No Socket Lobby Pair Found]: ${socket.id}`
                );
                return;
            }
            const { lobbyId, playerId: leavingPlayersId } = response;
            const lobby = await redisService.get(`LOBBY:${lobbyId}`);
            const disconnectedPlayer = lobby.players.find((player) => player.id == leavingPlayersId);

            lobby.players = lobby.players.filter(
                (player) => player.id !== leavingPlayersId
            );

            if (lobby.players.length > 0 && lobby.admin === leavingPlayersId) {
                lobby.admin = lobby.players[0].id;
            }

            await redisService.delete(`SOCKET:${socket.id}`);
            await redisService.set(`LOBBY:${lobbyId}`, lobby);

            io.to(lobbyId).emit(
                SocketEvents.LOBBY_UPDATED,
                new SocketPayload(true, null, { lobby })
            );

            if (lobby.activeGameInstanceId != null) {
                io.to(lobbyId).emit(
                    SocketEvents.PLAYER_DISCONNECTED,
                    new SocketPayload(true, null, { navigateToLobby: true, disconnectedPlayer: disconnectedPlayer }) //change to true or false based on if we want to navigate to lobby or not.
                );
            }

            timelog(`Client disconnected: ${socket.id}`);
        });
    });
};
