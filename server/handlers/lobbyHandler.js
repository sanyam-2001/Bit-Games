import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import { generateLobbyId } from "../utils/LobbyUtils.js";
import Lobby from "../Models/Lobby.model.js";
import Player from "../Models/Player.model.js";
import { GameId } from "../enums/GameId.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";

const handleJoinLobby = async (io, socket, { name, lobbyId }) => {
    try {
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);
        if (!lobby) {
            throw Error("Lobby not found");
        }
        const newPlayer = new Player(uuid(), name);
        lobby.players.push(newPlayer);
        const response = await redisService.set(`LOBBY:${lobbyId}`, lobby);
        if (!response) {
            throw Error("Lobby join failed");
        }
        socket.join(lobbyId);
        socket.emit(events.ENTER_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));
        io.in(lobbyId).emit(events.USER_JOINED_LOBBY, new SocketPayload(true, null, { lobby, newPlayer }));
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

export const registerLobbyHandlers = (io, socket) => {
    socket.on(events.JOIN_LOBBY, (data) => handleJoinLobby(io, socket, data));
    socket.on(events.CREATE_LOBBY, (data) => handleCreateLobby(io, socket, data));
    socket.on(events.TOGGLE_PLAYER_STATUS, (data) => handleTogglePlayerStatus(io, socket, data));
};
