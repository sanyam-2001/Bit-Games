import { SocketEvents } from "../enums/SocketEvents.enum.js"
import LandIO from "../Models/LandIO/LandIO.model.js";
import SocketPayload from "../Models/SocketPayload.model.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";

const handleCreateGame = async (io, socket, data, landGameServiceInstance) => {
    const { lobbyId } = data;
    const lobby = await redisService.get(`LOBBY:${lobbyId}`);
    if (!lobby) throw "Lobby Not Found!";
    const landGameInstance = new LandIO(
        uuid(),
        "Land.IO",
        "Land.IO",
        lobby.players
    );
    landGameServiceInstance.addGame(landGameInstance);

    io.in(lobbyId).emit(SocketEvents.START_GAME_4, new SocketPayload(true, null, landGameInstance));

}

export const registerLandHandlers = (io, socket, landGameServiceInstance) => {
    socket.on(SocketEvents.CREATE_GAME_4, (data) => handleCreateGame(io, socket, data, landGameServiceInstance));
} 