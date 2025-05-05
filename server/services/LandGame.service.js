export class LandGameService {
    constructor() {
        this.activeGames = [];
    }

    addGame = (game) => {
        this.activeGames.push(game);
    }
}