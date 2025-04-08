class Game {
  constructor(id, name, description, isTurnBased = false) {
    this.id = id; //enum
    this.name = name;
    this.description = description;
    this.isTurnBased = isTurnBased; //boolean
  }
}

export default Game;
