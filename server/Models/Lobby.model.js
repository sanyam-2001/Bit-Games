class Lobby {
  constructor(id, players, admin, gameId) {
    this.id = id;
    this.players = players; //array of player objects
    this.admin = admin; //player id (uuid)
    this.gameId = gameId; //game id (enum)
  }
}

export default Lobby;
