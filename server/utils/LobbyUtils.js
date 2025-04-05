import Player from "../Models/Player.model.js";

export const generateLobbyId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const getSystemUser = () => {
    const newPlayer = new Player(1, "System");
    return newPlayer;
}