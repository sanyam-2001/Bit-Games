import { formatTime } from "../utils/GlobalUtils.js";

class ChatMessage{
    constructor(id, sender, message, timestamp = new Date()) {
        this.id = id; 
        this.sender = sender;
        this.message = message;
        this.type = "text";
        this.formattedTimestamp = formatTime(timestamp);
        this.timestamp = timestamp;
    }
}

export default ChatMessage;