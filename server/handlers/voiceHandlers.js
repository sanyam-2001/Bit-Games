import { SocketEvents } from '../enums/SocketEvents.enum.js';
import { timelog } from '../utils/LoggingUtils.js';

const voiceLobbies = {};

const handleJoinVoiceRequest = (io, socket, data) => {
    const { lobbyId, userId } = data;
    timelog(`User ${userId} requested to join voice chat for lobby ${lobbyId}`);
    // First Time Created
    if (!voiceLobbies[lobbyId]) {
        voiceLobbies[lobbyId] = [];
    }
    if (!voiceLobbies[lobbyId].some(user => user.id === userId)) {
        voiceLobbies[lobbyId].push({
            id: userId,
            socketId: socket.id
        });
    }

    //Notify Existing Users that new user has joined
    socket.to(lobbyId).emit(SocketEvents.NEW_VOICE_USER_JOINED, {
        userId,
        socketId: socket.id
    });

    // Send List of Current Users in Voice Chat to the new user
    voiceLobbies[lobbyId].forEach(user => {
        if (user.id !== userId) {
            socket.emit(SocketEvents.EXISTING_VOICE_USER_JOINED, {
                userId: user.id,
                socketId: user.socketId
            });
        }
    });
}


export const registerVoiceHandlers = (io, socket) => {
    socket.on(SocketEvents.JOIN_VOICE_REQUEST, (data) => handleJoinVoiceRequest(io, socket, data));
}
