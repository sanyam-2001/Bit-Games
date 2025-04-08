import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import { generateLobbyId, getSystemUser } from "../utils/LobbyUtils.js";
import Lobby from "../Models/Lobby.model.js";
import Player from "../Models/Player.model.js";
import { GameId } from "../enums/GameId.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";
import ChatMessage from "../Models/ChatMessage.model.js";
import { TicTacToe } from "../Models/TicTacToe.model.js";

const handleTicTacToeGame = async (io, socket, data) => {
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

  await redisService.set(`GAME:TIC_TAC_TOE:${game.id}`, game);

  io.in(lobbyId).emit(events.START_GAME, new SocketPayload(true, null, game));
};

export const registerTicTacToeHandlers = (io, socket) => {
  socket.on(events.CREATE_GAME_1, (data) =>
    handleTicTacToeGame(io, socket, data)
  );
};
