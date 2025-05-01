import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";
import { TicTacToe } from "../models/TicTacToe.model.js";

const handleCreateGame = async (io, socket, data) => {
    try {
        const { lobbyId } = data;
        const lobby = await redisService.get(`LOBBY:${lobbyId}`);

        if (!lobby) {
            throw Error("Lobby not found");
        }

        const game = new TicTacToe(
            uuid(),
            "Tic Tac Toe",
            "Tic Tac Toe",
            lobby.players[0].id,
            lobby.players[1].id
        );
        lobby.activeGameInstanceId = game.id;

        await redisService.set(`LOBBY:${lobbyId}`, lobby);
        await redisService.set(`GAME:TIC_TAC_TOE:${game.id}`, game);

        timelog(`Tic Tac Toe Game Created: ${game.id} in Lobby: ${lobbyId}`);
        io.in(lobbyId).emit(events.START_GAME_1, new SocketPayload(true, null, game));

    } catch (error) {
        timelog(`Error in Creating Tic Tac Toe Game: ${error}`);
    }
};

export const registerTicTacToeHandlers = (io, socket) => {
    socket.on(events.CREATE_GAME_1, (data) => handleCreateGame(io, socket, data));
};
