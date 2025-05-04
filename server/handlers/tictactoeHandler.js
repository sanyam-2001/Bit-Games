import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import redisService from "../services/Redis.service.js";
import { v4 as uuid } from "uuid";
import SocketPayload from "../Models/SocketPayload.model.js";
import { TicTacToe } from "../Models/TicTacToe.model.js";

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

const handleTTTMove = async (io, socket, data) => {
    const { rowIndex, colIndex, draggedCup, lobbyId } = data;
    const { color, index } = draggedCup;
    const weight = index + 1;

    const lobby = await redisService.get(`LOBBY:${lobbyId}`);
    const game = await redisService.get(`GAME:TIC_TAC_TOE:${lobby.activeGameInstanceId}`);
    const gameInstance = TicTacToe.parse(game);
    // Update GameState
    gameInstance.gameState.board[rowIndex][colIndex] = { color, weight };

    // Active Cup removal
    if (color == "pink") gameInstance.gameState.pinkPlayer.cups[index] = 0;
    else gameInstance.gameState.bluePlayer.cups[index] = 0;

    // Flip Turn
    gameInstance.gameState.flipTurn();

    await redisService.set(`GAME:TIC_TAC_TOE:${gameInstance.id}`, gameInstance);
    io.in(lobbyId).emit(events.TTT_GAME_UPDATE_1, new SocketPayload(true, null, gameInstance));

    // TO-DO: Check if Game Complete -> Sep Method
    const { isGameOver, winnerId } = gameInstance.checkIfGameOver();

    if (!isGameOver) return;

    if (!winnerId) {
        //Increase Both scores by 1
        gameInstance.gameState.score.blue += 1;
        gameInstance.gameState.score.pink += 1;
    } else {
        // Increase Only
        if (gameInstance.gameState.bluePlayer.playerId === winnerId) gameInstance.gameState.score.blue += 1;
        if (gameInstance.gameState.pinkPlayer.playerId === winnerId) gameInstance.gameState.score.pink += 1;
    }

    await redisService.set(`GAME:TIC_TAC_TOE:${gameInstance.id}`, gameInstance);
    io.in(lobbyId).emit(events.TTT_GAME_OVER_1, new SocketPayload(true, null, {
        winnerId,
        gameInstance
    }));

}

const handleGameRestart = async (io, socket, data) => {
    const { lobbyId } = data;

    const lobby = await redisService.get(`LOBBY:${lobbyId}`);
    const game = await redisService.get(`GAME:TIC_TAC_TOE:${lobby.activeGameInstanceId}`);

    const gameInstance = TicTacToe.parse(game);
    gameInstance.gameState.resetGame();

    await redisService.set(`GAME:TIC_TAC_TOE:${game.id}`, gameInstance);
    io.in(lobbyId).emit(events.TTT_GAME_UPDATE_1, new SocketPayload(true, null, {
        isGameRestart: true,
        gameState: gameInstance.gameState
    }));


}

export const registerTicTacToeHandlers = (io, socket) => {
    socket.on(events.CREATE_GAME_1, (data) => handleCreateGame(io, socket, data));
    socket.on(events.TTT_MOVE_1, (data) => handleTTTMove(io, socket, data));
    socket.on(events.TTT_GAME_RESTART_1, (data) => handleGameRestart(io, socket, data));
};
