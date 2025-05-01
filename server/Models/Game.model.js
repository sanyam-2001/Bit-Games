class Game {
    constructor(id, name, description, isTurnBased = false) {
        this.id = id; //UUID of Game Instance
        this.name = name;
        this.description = description;
        this.isTurnBased = isTurnBased; //boolean
    }
}

export default Game;
