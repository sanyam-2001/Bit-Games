import { SocketEvents } from '../enums/SocketEvents.enum.js';
import { timelog } from '../utils/LoggingUtils.js';

const voiceLobbies = {};

const handleJoinVoiceRequest = (io, socket, data) => {
    const { lobbyId, userId } = data;
    timelog(`User ${socket.id} requested to join voice chat for lobby ${lobbyId}`);
    // First Time Created
    if (!voiceLobbies[lobbyId]) {
        voiceLobbies[lobbyId] = [];
    }
    if (!voiceLobbies[lobbyId].some(user => user.userId === userId)) {
        voiceLobbies[lobbyId].push({
            userId: userId,
            socketId: socket.id
        });
    }

    //Notify Existing Users that new user has joined
    // socket.to(lobbyId).emit(SocketEvents.NEW_VOICE_USER_JOINED, {
    //     userId,
    //     socketId: socket.id
    // });

    // Send List of Current Users in Voice Chat to the new user
    voiceLobbies[lobbyId].forEach(user => {
        if (user.userId !== userId) {
            socket.emit(SocketEvents.EXISTING_VOICE_USER_JOINED, {
                userId: user.id,
                socketId: user.socketId
            });
        }
    });
}

const handleSendIceCandidate = (io, socket, data) => {

    const { candidate, receiverId } = data;
    io.to(receiverId).emit(SocketEvents.RECEIVE_ICE_CANDIDATE, {
        candidate,
        senderId: socket.id
    });
}

const handleSendOffer = (io, socket, data) => {
    const { offer, receiverId, senderId, lobbyId } = data;
    console.log(`Sending Offer From ${senderId} to ${receiverId}`);

    io.to(receiverId).emit(SocketEvents.RECEIVE_OFFER, {
        offer,
        senderId: socket.id
    });
}

const handleSendAnswer = (io, socket, data) => {

}

export const registerVoiceHandlers = (io, socket) => {
    socket.on(SocketEvents.JOIN_VOICE_REQUEST, (data) => handleJoinVoiceRequest(io, socket, data));
    socket.on(SocketEvents.SEND_ICE_CANDIDATE, (data) => handleSendIceCandidate(io, socket, data));
    socket.on(SocketEvents.SEND_OFFER, (data) => handleSendOffer(io, socket, data));
    socket.on(SocketEvents.SEND_ANSWER, (data) => handleSendAnswer(io, socket, data));
}
