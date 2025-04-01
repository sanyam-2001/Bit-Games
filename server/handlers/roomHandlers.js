import { timelog } from "../utils/LoggingUtils.js";
import { Console } from "console";

export const handleJoinLobby = (socket, { name, lobbyId }) => {
  console.log("In lobby", lobbyId);
};

export const handleCreateLobby = (socket, { name }) => {
  console.log("Created lobby");
};
