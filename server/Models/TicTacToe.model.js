import Game from "./Game.model.js";

export class TicTacToe extends Game {
    constructor(id, name, description, bluePlayerId, pinkPlayerId) {
        super(id, name, description, true);
        this.gameState = new GameState(bluePlayerId, bluePlayerId, pinkPlayerId);
    }

    setGameState = (gameState) => {
        this.gameState = gameState;
    }
    static parse = ({ id, name, description, isTurnBased, gameState }) => {

        const gameInstance = new TicTacToe();
        gameInstance.id = id;
        gameInstance.name = name;
        gameInstance.description = description;
        gameInstance.isTurnBased = isTurnBased
        gameInstance.gameState = GameState.parse(gameState);
        return gameInstance;
    }

    // Helper function to check if all elements in an array have the same color
    #hasSameColor = (arr) => {
        if (!arr[0] || !arr[1] || !arr[2] || arr[0].color === "") return false;
        return arr[0].color === arr[1].color && arr[1].color === arr[2].color;
    };
    // Returns {
    // {true, WINNER_ID} // Winner
    // {true, null} // Draw
    // {false, null} // No
    // }
    checkIfGameOver = () => {
        //Check if Someone Won
        const board = this.gameState.board;
        const blueCups = this.gameState.bluePlayer.cups;
        const pinkCups = this.gameState.pinkPlayer.cups;

        // Check rows
        for (let i = 0; i < 3; i++) {
            if (this.#hasSameColor(board[i])) {
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
            if (this.#hasSameColor(column)) {
                return {
                    isGameOver: true,
                    winnerId: column[0].color === 'blue'
                        ? this.gameState.bluePlayer.playerId
                        : this.gameState.pinkPlayer.playerId
                };
            }
        }

        // Check diagonals
        const diagonal1 = [board[0][0], board[1][1], board[2][2]];
        const diagonal2 = [board[0][2], board[1][1], board[2][0]];

        if (this.#hasSameColor(diagonal1)) {
            return {
                isGameOver: true,
                winnerId: diagonal1[0].color === 'blue'
                    ? this.gameState.bluePlayer.playerId
                    : this.gameState.pinkPlayer.playerId
            };
        }
        if (this.#hasSameColor(diagonal2)) {
            return {
                isGameOver: true,
                winnerId: diagonal2[0].color === 'blue'
                    ? this.gameState.bluePlayer.playerId
                    : this.gameState.pinkPlayer.playerId
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

}

class GameState {
    constructor(turnId, bluePlayerId, pinkPlayerId) {
        this.board = initialTicTacToeBoard;
        this.bluePlayer = { playerId: bluePlayerId, cups: [1, 1, 1, 1, 1] };
        this.pinkPlayer = { playerId: pinkPlayerId, cups: [1, 1, 1, 1, 1] };
        this.score = { blue: 0, pink: 0 };
        this.turnId = turnId;
        this.startTurnId = turnId;
    }

    static parse = (gameState) => {
        const gameStateInstance = new GameState();
        gameStateInstance.board = gameState.board;
        gameStateInstance.bluePlayer = gameState.bluePlayer;
        gameStateInstance.pinkPlayer = gameState.pinkPlayer;
        gameStateInstance.score = gameState.score;
        gameStateInstance.turnId = gameState.turnId;
        gameStateInstance.startTurnId = gameState.turnId;
        return gameStateInstance;
    }
    resetGame = () => {
        this.flipStartTurn();
        this.resetBoard();
        this.resetCups();
    }

    flipStartTurn = () => {
        const newTurnId = this.#getNextTurnId();
        this.turnId = newTurnId;
        this.startTurnId = newTurnId;
    }

    flipTurn = () => {
        this.turnId = (this.bluePlayer.playerId === this.turnId)
            ? this.pinkPlayer.playerId
            : this.bluePlayer.playerId
    }

    resetCups = () => {
        this.bluePlayer.cups = [1, 1, 1, 1, 1];
        this.pinkPlayer.cups = [1, 1, 1, 1, 1];
    }
    resetBoard = () => {
        this.board = initialTicTacToeBoard;
    }
    #getNextTurnId = () => {
        const startId = this.startTurnId;
        const newTurnId = this.bluePlayer.playerId === startId
            ? this.pinkPlayer.playerId
            : this.bluePlayer.playerId;

        return newTurnId;
    }

}

const initialTicTacToeBoard = [
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
]
