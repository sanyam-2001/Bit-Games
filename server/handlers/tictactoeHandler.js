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

const handleTTTMove = async (io, socket, data) => {
    const { rowIndex, colIndex, draggedCup, lobbyId } = data;
    const { color, index } = draggedCup;
    const weight = index + 1;

    const lobby = await redisService.get(`LOBBY:${lobbyId}`);
    const game = await redisService.get(`GAME:TIC_TAC_TOE:${lobby.activeGameInstanceId}`);
    // Update GameState
    game.gameState.board[rowIndex][colIndex] = { color, weight };
    // Active Cup removal
    if (color == "pink") game.gameState.pinkPlayer.cups[index] = 0;
    else game.gameState.bluePlayer.cups[index] = 0;
    // Flip Turn

    game.gameState.turnId = (game.gameState.bluePlayer.playerId === game.gameState.turnId)
        ? game.gameState.pinkPlayer.playerId
        : game.gameState.bluePlayer.playerId

    await redisService.set(`GAME:TIC_TAC_TOE:${game.id}`, game);
    io.in(lobbyId).emit(events.TTT_GAME_UPDATE_1, new SocketPayload(true, null, game));

    // TO-DO: Check if Game Complete -> Sep Method
    const { isGameOver, winnerId } = checkIfGameOver(game);

    if (!isGameOver) return;

    if (!winnerId) {
        //Increase Both scores by 1
        game.gameState.score.blue += 1;
        game.gameState.score.pink += 1;
    } else {
        // Increase Only
        if (game.gameState.bluePlayer.playerId === winnerId) game.gameState.score.blue += 1;
        if (game.gameState.pinkPlayer.playerId === winnerId) game.gameState.score.pink += 1;
    }

    await redisService.set(`GAME:TIC_TAC_TOE:${game.id}`, game);
    io.in(lobbyId).emit(events.TTT_GAME_OVER_1, new SocketPayload(true, null, {
        winnerId,
        game
    }));

}
// Returns {
// {true, WINNER_ID} // Winner
// {true, null} // Draw
// {false, null} // No
// }
const checkIfGameOver = (game) => {
    //Check if Someone Won
    const board = game.gameState.board;
    const blueCups = game.gameState.bluePlayer.cups;
    const pinkCups = game.gameState.pinkPlayer.cups;

    // Helper function to check if all elements in an array have the same color
    const hasSameColor = (arr) => {
        if (!arr[0] || !arr[1] || !arr[2] || arr[0].color === "") return false;
        return arr[0].color === arr[1].color && arr[1].color === arr[2].color;
    };

    // Check rows
    for (let i = 0; i < 3; i++) {
        if (hasSameColor(board[i])) {
            return {
                isGameOver: true,
                winnerId: board[i][0].color === 'blue'
                    ? game.gameState.bluePlayer.playerId
                    : game.gameState.pinkPlayer.playerId
            };
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        const column = [board[0][i], board[1][i], board[2][i]];
        if (hasSameColor(column)) {
            return {
                isGameOver: true,
                winnerId: column[0].color === 'blue'
                    ? game.gameState.bluePlayer.playerId
                    : game.gameState.pinkPlayer.playerId
            };
        }
    }

    // Check diagonals
    const diagonal1 = [board[0][0], board[1][1], board[2][2]];
    const diagonal2 = [board[0][2], board[1][1], board[2][0]];

    if (hasSameColor(diagonal1)) {
        return {
            isGameOver: true,
            winnerId: diagonal1[0].color === 'blue'
                ? game.gameState.bluePlayer.playerId
                : game.gameState.pinkPlayer.playerId
        };
    }
    if (hasSameColor(diagonal2)) {
        return {
            isGameOver: true,
            winnerId: diagonal2[0].color === 'blue'
                ? game.gameState.bluePlayer.playerId
                : game.gameState.pinkPlayer.playerId
        };
    }

    // Check if all cups are used
    const allBlueCupsUsed = blueCups.every(cup => cup === 0);
    const allPinkCupsUsed = pinkCups.every(cup => cup === 0);
    if (allBlueCupsUsed && allPinkCupsUsed) {
        return { isGameOver: true, winnerId: null }; // Draw
    }

    // Check if board is full and remaining cup is smallest
    const isBoardFull = board.every(row => row.every(cell => cell.color !== ""));
    if (isBoardFull && (blueCups[0] == 1 || pinkCups[0] == 1)) {
        return { isGameOver: true, winnerId: null }; // Draw - no valid moves left
    }

    return { isGameOver: false, winnerId: null }; // Game continues
}


export const registerTicTacToeHandlers = (io, socket) => {
    socket.on(events.CREATE_GAME_1, (data) => handleCreateGame(io, socket, data));
    socket.on(events.TTT_MOVE_1, (data) => handleTTTMove(io, socket, data));
};
