import { SocketEvents } from '../enums/SocketEvents.enum.js';
import { timelog } from '../utils/LoggingUtils.js';

const voiceLobbies = {};

const handleJoinVoiceRequest = (io, socket, data) => {
    const { lobbyId, userId } = data;
    timelog(`User ${socket.id} requested to join voice chat for lobby ${lobbyId}`);

    if (!voiceLobbies[lobbyId]) {
        voiceLobbies[lobbyId] = new Set();
    }

    voiceLobbies[lobbyId].add(socket.id);

    // If this is the first user, they will be the offerer
    const isFirstUser = voiceLobbies[lobbyId].size === 1;

    // Notify existing users about the new user
    socket.to(lobbyId).emit(SocketEvents.NEW_VOICE_USER_JOINED, {
        userId,
        socketId: socket.id,
        isOfferer: false // New users are always answerers
    });

    // Send existing users to the new user
    const existingUsers = Array.from(voiceLobbies[lobbyId])
        .filter(id => id !== socket.id)
        .map(id => ({
            socketId: id,
            userId: userId,
            isOfferer: true // Existing users are offerers
        }));

    existingUsers.forEach(user => {
        socket.emit(SocketEvents.EXISTING_VOICE_USER_JOINED, user);
    });
}

const handleSendIceCandidate = (io, socket, data) => {
    const { candidate, receiverId, lobbyId } = data;
    io.to(receiverId).emit(SocketEvents.RECEIVE_ICE_CANDIDATE, {
        candidate,
        senderId: socket.id,
        lobbyId
    });
}

const handleSendOffer = (io, socket, data) => {
    const { offer, receiverId, senderId, lobbyId } = data;
    timelog(`Sending Offer From ${senderId} to ${receiverId} in lobby ${lobbyId}`);

    io.to(receiverId).emit(SocketEvents.RECEIVE_OFFER, {
        offer,
        senderId: socket.id,
        receiverId,
        lobbyId
    });
}

const handleSendAnswer = (io, socket, data) => {
    const { answer, receiverId, senderId, lobbyId } = data;
    timelog(`Sending Answer From ${senderId} to ${receiverId} in lobby ${lobbyId}`);

    io.to(receiverId).emit(SocketEvents.RECEIVE_ANSWER, {
        answer,
        senderId: socket.id,
        receiverId,
        lobbyId
    });
}

const handleDisconnect = (io, socket) => {
    Object.entries(voiceLobbies).forEach(([lobbyId, users]) => {
        if (users.has(socket.id)) {
            users.delete(socket.id);
            io.to(lobbyId).emit(SocketEvents.VOICE_USER_LEFT, {
                socketId: socket.id,
                lobbyId
            });
        }
    });
}

export const registerVoiceHandlers = (io, socket) => {
    socket.on(SocketEvents.JOIN_VOICE_REQUEST, (data) => handleJoinVoiceRequest(io, socket, data));
    socket.on(SocketEvents.SEND_ICE_CANDIDATE, (data) => handleSendIceCandidate(io, socket, data));
    socket.on(SocketEvents.SEND_OFFER, (data) => handleSendOffer(io, socket, data));
    socket.on(SocketEvents.SEND_ANSWER, (data) => handleSendAnswer(io, socket, data));
    socket.on('disconnect', () => handleDisconnect(io, socket));
}
