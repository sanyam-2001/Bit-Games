import { useState, useEffect } from "react";
import { useGlobal } from "../../../context/GlobalContext";
import { useSocket } from "../../../context/SocketContext";
import { SocketEvents } from "../../../enums/socketevents.enums";

const TicTacToe = () => {
    const { socket, connected } = useSocket();
    const { lobby, currentUser } = useGlobal();
    const [, setGameState] = useState({});

    useEffect(() => {
        if (socket && connected && lobby.admin === currentUser.id) {
            socket.emit(SocketEvents.CREATE_GAME_1, { lobbyId: lobby.id });
        }
    }, [lobby, currentUser, socket, connected]);

    useEffect(() => {
        if (socket && connected)
            socket.on(SocketEvents.START_GAME_1, ({ success, error, data }) => {
                setGameState(data?.gameState);
            });

        return () => {
            if (socket) {
                socket.off(SocketEvents.START_GAME_1);
            }
        };
    }, [setGameState, socket, connected]);

    return <div>TicTacToe</div>;
};

export default TicTacToe;
