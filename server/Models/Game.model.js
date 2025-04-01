class Game {
  constructor(id, name, description, isTurnBased, turnId) {
    this.id = id; //enum
    this.name = name;
    this.description = description;
    this.isTurnBased = isTurnBased; //boolean
    this.turnId = turnId; //player uuid
  }
}

export default Game;
