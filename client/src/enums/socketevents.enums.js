const LobbySocketEvents = {
    JOIN_LOBBY: "JOIN_LOBBY",
    CREATE_LOBBY: "CREATE_LOBBY",
    ENTER_LOBBY: "ENTER_LOBBY",
    USER_JOINED_LOBBY: "USER_JOINED_LOBBY",
    TOGGLE_PLAYER_STATUS: "TOGGLE_PLAYER_STATUS",
    LOBBY_UPDATED: "LOBBY_UPDATED",
    NAVIGATE_TO_GAME: "NAVIGATE_TO_GAME",
}
const ChatSocketEvents = {
    SEND_CHAT_MESSAGE: "SEND_CHAT_MESSAGE",
    RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE",
}

const TicTacToeSocketEvents = {
    CREATE_GAME_1: "CREATE_GAME_1",
    START_GAME_1: "START_GAME_1",
}

export const SocketEvents = {
    ...LobbySocketEvents,
    ...ChatSocketEvents,
    ...TicTacToeSocketEvents,
};

