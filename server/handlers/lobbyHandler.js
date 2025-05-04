import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import { generateLobbyId, getSystemUser } from "../utils/LobbyUtils.js";
import Lobby from "../Models/Lobby.model.js";
import Player from "../Models/Player.model.js";
import { GameId } from "../enums/GameId.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";
import ChatMessage from "../Models/ChatMessage.model.js";


const handleJoinLobby = async (io, socket, { name, lobbyId }) => {
    try {
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);

        if (!lobby) {
            throw Error("Lobby not found");
        }

        const newPlayer = new Player(uuid(), name);
        lobby.players.push(newPlayer);
        const response = await redisService.set(`LOBBY:${lobbyId}`, lobby);
        await redisService.set(`SOCKET:${socket.id}`, { lobbyId, playerId: newPlayer.id });
        if (!response) {
            throw Error("Lobby join failed");
        }
        socket.join(lobbyId);
        socket.emit(events.ENTER_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));

        const newChatMessage = new ChatMessage(uuid(), getSystemUser(), newPlayer.name + " joined the lobby!");
        io.in(lobbyId).emit(events.USER_JOINED_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));
        io.in(lobbyId).emit(events.RECEIVE_CHAT_MESSAGE, new SocketPayload(true, null, newChatMessage));
    }
    catch (error) {
        console.error(error);
        socket.emit(
            events.ENTER_LOBBY,
            new SocketPayload(false, "Room Creation Failed :(", null)
        );
    }
};

const handleCreateLobby = async (io, socket, { name: username }) => {
    try {
        const lobbyId = generateLobbyId();
        const newPlayer = new Player(uuid(), username);
        const lobby = new Lobby(lobbyId, [newPlayer], newPlayer.id, GameId.NO_GAME);

        const response = await redisService.set(`LOBBY:${lobbyId}`, lobby);
        await redisService.set(`SOCKET:${socket.id}`, { lobbyId, playerId: newPlayer.id });
        if (!response) {
            throw Error("Lobby creation failed");
        }
        socket.join(lobbyId);
        socket.emit(events.ENTER_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));
        io.in(lobbyId).emit(events.USER_JOINED_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));
    } catch (error) {
        console.error(error);

        socket.emit(
            events.ENTER_LOBBY,
            new SocketPayload(false, "Room Creation Failed :(", null)
        );
    }
};

const handleTogglePlayerStatus = async (io, socket, { lobbyId, playerId }) => {
    try {
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);
        if (!lobby) {
            throw Error("Lobby not found");
        }
        const playerIndex = lobby.players.findIndex((player) => player.id === playerId);
        if (playerIndex === -1) {
            throw Error("Player not found");
        }
        lobby.players[playerIndex].status = lobby.players[playerIndex].status === "Ready" ? "Not-Ready" : "Ready";
        await redisService.set(`LOBBY:${lobbyId}`, lobby);
        io.in(lobbyId).emit(events.LOBBY_UPDATED, new SocketPayload(true, null, { lobby }));
    } catch (error) {
        console.error(error);
    }
}

const handleNavigateToGame = async (io, socket, { lobbyId, gameId }) => {
    try{
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);
        
        if (!lobby) {
            throw Error("Lobby not found");
        }

        lobby.gameId = gameId;
        const response = await redisService.set(`LOBBY:${lobbyId}`, lobby);
        if (!response) {
            throw Error("Lobby set method failed");
        }

        timelog(`Navigating to game in ${lobbyId} , game ${gameId}}` );
        io.in(lobbyId).emit(events.NAVIGATE_TO_GAME, new SocketPayload(true, null,{ lobby }));
    }
    catch(error){
        console.error(error);
    }
}

const handleBackToTheLobby =  async (io, socket, { lobbyId }) => {
    try{
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);
        
        if (!lobby) {
            throw Error("Lobby not found");
        }

        lobby.gameId = GameId.NO_GAME;
        lobby.activeGameInstanceId = null;  

        const response = await redisService.set(`LOBBY:${lobbyId}`, lobby);

        if (!response) {
            throw Error("Lobby set method failed");
        }

        timelog(`Navigating to lobby in ${lobbyId}}` );
        io.in(lobbyId).emit(events.NAVIGATE_TO_LOBBY, new SocketPayload(true, null,{ lobby }));
    }
    catch(error){
        console.error(error);
    }
}

export const registerLobbyHandlers = (io, socket) => {
    socket.on(events.JOIN_LOBBY, (data) => handleJoinLobby(io, socket, data));
    socket.on(events.CREATE_LOBBY, (data) => handleCreateLobby(io, socket, data));
    socket.on(events.TOGGLE_PLAYER_STATUS, (data) => handleTogglePlayerStatus(io, socket, data));
    socket.on(events.NAVIGATE_TO_GAME, (data) => handleNavigateToGame(io, socket, data ));
    socket.on(events.BACK_TO_THE_LOBBY, (data) => handleBackToTheLobby(io, socket, data));
};
