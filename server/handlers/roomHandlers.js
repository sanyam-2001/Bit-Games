export const handleJoinLobby = (socket, data) => {
    socket.emit("enterLobby");
};

export const handleCreateLobby = (socket, data) => {
    socket.emit("enterLobby");
};
