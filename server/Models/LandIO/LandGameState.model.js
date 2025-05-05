import color from '../../static/Color.json' with { type: 'json' };

class LandGameState {
    constructor(playerList) {
        this.boardSize = 10;
        this.board = getInitialLand(this.boardSize);
        this.players = playerList.map((player, index) => new LandPlayer(player, index, this.boardSize));
        this.time = 180;
        this.initBoard();
    }
    initBoard = () => {
        // For Each player give an inital 3X3 of their color around their spawn
        this.players.forEach(player => {
            const x = player.posX;
            const y = player.posY;
            // Mark a 3x3 grid around spawn as owned by the player
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newX = x + i;
                    const newY = y + j;
                    // Check if the position is within the board
                    if (newX >= 0 && newX < this.boardSize && newY >= 0 && newY < this.boardSize) {
                        this.board[newY][newX].status = LandCellStatus.OWNED;
                        this.board[newY][newX].color = player.color;
                        this.board[newY][newX].interactingPlayerId = player.id;
                    }
                }
            }
        });


    }
}
const LandCellStatus = {
    EMPTY: "EMPTY",
    SEMI: "SEMI",
    OWNED: "OWNED"
}
class LandCell {
    constructor() {
        this.status = LandCellStatus.EMPTY;
        this.color = color[color.length - 1];
        this.interactingPlayerId = null;
    }
}

class LandPlayer {
    constructor(player, index, boardSize) {
        this.id = player.id;
        this.name = player.name;
        this.status = true;
        this.color = getInitialColor(index);
        this.posX = getInitialPosition(index, boardSize).x;
        this.posY = getInitialPosition(index, boardSize).y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.playerAlive = true;
    }
}

const getInitialLand = (boardSize) => {
    return Array(boardSize).fill().map(() => Array(boardSize).fill().map(() => new LandCell()));
}

const getInitialColor = (index) => {
    return color[index];
}
const getInitialPosition = (index, boardSize) => {
    const positions = [
        { x: 1, y: 1 },                    // top-left corner (middle of 3x3)
        { x: boardSize - 2, y: 1 },        // top-right corner (middle of 3x3)
        { x: 1, y: boardSize - 2 },        // bottom-left corner (middle of 3x3)
        { x: boardSize - 2, y: boardSize - 2 }, // bottom-right corner (middle of 3x3)
        { x: Math.floor(boardSize / 2), y: 1 },           // top edge midpoint (middle of 3x3)
        { x: boardSize - 2, y: Math.floor(boardSize / 2) }, // right edge midpoint (middle of 3x3)
        { x: Math.floor(boardSize / 2), y: boardSize - 2 }, // bottom edge midpoint (middle of 3x3)
        { x: 1, y: Math.floor(boardSize / 2) }            // left edge midpoint (middle of 3x3)
    ];

    return positions[index];
}

export default LandGameState;