import { timelog } from "../utils/LoggingUtils.js";

const handleJoinLobby = (socket, { name, lobbyId }) => {
    timelog("In lobby", lobbyId);
};

const handleCreateLobby = (socket, { name }) => {
    timelog("Created lobby In Lobby");
};

export const registerLobbyHandlers = (socket) => {
    socket.on('joinLobby', (data) => handleJoinLobby(socket, data));
    socket.on('createLobby', (data) => handleCreateLobby(socket, data));
};

