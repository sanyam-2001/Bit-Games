import { SocketEvents as events } from "../enums/SocketEvents.enum.js";
import ChatMessage from "../Models/ChatMessage.model.js";
import SocketPayload from "../Models/SocketPayload.model.js";

const handleMessageSent = async (io, socket, { message, lobbyId }) => {
    try {
        const newChatMessage = new ChatMessage (message.id, message.sender, message.message);
        console.log("Message recieved: ", newChatMessage.message);
        io.in(lobbyId).emit(events.RECEIVE_CHAT_MESSAGE,  new SocketPayload(true, null, newChatMessage));
    }
    catch(ex)
    {
        console.log(ex);
    }
};

export const registerChatHandlers = (io, socket) => {
    socket.on(events.SEND_CHAT_MESSAGE, (data) => handleMessageSent(io, socket, data));
};