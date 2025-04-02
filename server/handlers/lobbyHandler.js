import { timelog } from "../utils/LoggingUtils.js";
import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import { generateLobbyId } from "../utils/LobbyUtils.js";
import Lobby from "../Models/Lobby.model.js";
import Player from "../Models/Player.model.js";
import { GameId } from "../enums/GameId.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";

const handleJoinLobby = async (socket, { name, lobbyId }) => {
    try {
        const lobby = await redisService.get(lobbyId);
        console.log(lobby);
    }
    catch (error) {
        console.error(error);
    }
};

const handleCreateLobby = async (socket, { name: username }) => {
    try {
        const lobbyId = generateLobbyId();
        const player = new Player(uuid(), username);
        const lobby = new Lobby(lobbyId, [player], player.id, GameId.NO_GAME);

        const response = await redisService.set(lobbyId, lobby);

        if (!response) {
            throw Error("Lobby creation failed");
        }
        socket.join(lobbyId);
        socket.emit(events.ENTER_LOBBY, new SocketPayload(true, null, { lobby }));
    } catch (error) {
        console.error(error);

        socket.emit(
            events.ENTER_LOBBY,
            new SocketPayload(false, "Room Creation Failed :(", null)
        );
    }
};

export const registerLobbyHandlers = (socket) => {
    socket.on(events.JOIN_LOBBY, (data) => handleJoinLobby(socket, data));
    socket.on(events.CREATE_LOBBY, (data) => handleCreateLobby(socket, data));
};
