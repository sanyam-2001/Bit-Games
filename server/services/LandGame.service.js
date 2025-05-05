import { SocketEvents } from "../enums/SocketEvents.enum.js";
import SocketPayload from "../Models/SocketPayload.model.js";
export class LandGameService {
    constructor() {
        this.activeGames = [];
        this.GAME_TICK = 400;
    }

    addGame = (game) => {
        this.activeGames.push(game);
    }
    beginGame = (gameId, lobbyId, io) => {
        const intervalId = setInterval(() => {
            const index = this.activeGames.findIndex(game => game.id === gameId);
            if (index === -1) clearInterval(intervalId);
            const nextState = this.activeGames[index].gameState.getNextState();
            this.activeGames[index].gameState = nextState;

            io.in(lobbyId).emit(SocketEvents.GAME_STATE_UPDATE_4, new SocketPayload(true, null, this.activeGames[index]));

        }, this.GAME_TICK)
    }
    registerMove = (action, playerId, gameId) => {
        const index = this.activeGames.findIndex(game => game.id === gameId);
        this.activeGames[index].gameState.registerMove(action, playerId);
    }
}