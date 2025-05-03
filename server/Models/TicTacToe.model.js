import Game from "./Game.model.js";

export class TicTacToe extends Game {
    constructor(id, name, description, bluePlayerId, pinkPlayerId) {
        super(id, name, description, true);
        this.gameState = new GameState(bluePlayerId, bluePlayerId, pinkPlayerId);
    }

}

class GameState {
    constructor(turnId, bluePlayerId, pinkPlayerId) {
        this.board = [
            [
                { color: "", weight: 0 },
                { color: "", weight: 0 },
                { color: "", weight: 0 },
            ],
            [
                { color: "", weight: 0 },
                { color: "", weight: 0 },
                { color: "", weight: 0 },
            ],
            [
                { color: "", weight: 0 },
                { color: "", weight: 0 },
                { color: "", weight: 0 },
            ],
        ];
        this.bluePlayer = { playerId: bluePlayerId, cups: [1, 1, 1, 1, 1] };
        this.pinkPlayer = { playerId: pinkPlayerId, cups: [1, 1, 1, 1, 1] };
        this.score = { blue: 0, pink: 0 };
        this.turnId = turnId;
        this.startTurnId = turnId;
    }

}
