import { useState, useEffect } from "react";
import { useGlobal } from "../../../context/GlobalContext";
import { useSocket } from "../../../context/SocketContext";
import { SocketEvents } from "../../../enums/socketevents.enums";

const TicTacToe = () => {
  const { socket, connected } = useSocket();
  const [gameState, setGameState] = useState({});
  const { lobby, setLobby, currentUser, gameList } = useGlobal();

  useEffect(() => {
    if (socket && connected && lobby.admin === currentUser.id) {
      socket.emit(SocketEvents.CREATE_GAME_1, { lobbyId: lobby.id });
    }
  }, [lobby, currentUser, socket]);

  useEffect(() => {
    if (socket && connected)
      socket.on(SocketEvents.START_GAME, ({ success, error, data }) => {
        setGameState(data?.gameState);
        console.log(data);
      });

    return () => {
      if (socket) {
        socket.off(SocketEvents.START_GAME);
      }
    };
  }, [setGameState, socket, connected]);

  return <div>TicTacToe</div>;
};

export default TicTacToe;
