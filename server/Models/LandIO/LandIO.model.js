import Game from "../Game.model.js";
import LandGameState from './LandGameState.model.js';
class LandIO extends Game {
    constructor(id, name, desc, playerList) {
        super(id, name, desc);
        this.gameState = new LandGameState(playerList);
    }
}

export default LandIO;