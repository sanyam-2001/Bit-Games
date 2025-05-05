import React, { useEffect, useState } from 'react';
import styles from './LandIO.module.css';
import { useGlobal } from '../../../context/GlobalContext';
import { useSocket } from '../../../context/SocketContext';
import { SocketEvents } from '../../../enums/socketevents.enums';
import { defaultLandIOState } from '../../../utils/DefaultState';

const LandIO = () => {
    const { lobby, currentUser, setLobby } = useGlobal();
    const { socket, connected } = useSocket();
    const [gameState, setGameState] = useState(defaultLandIOState);

    useEffect(() => {
        if (socket && connected && lobby.admin === currentUser.id) {
            socket.emit(SocketEvents.CREATE_GAME_4, {
                lobbyId: lobby?.id
            });
        }
    }, [socket, connected, lobby, currentUser]);

    useEffect(() => {
        if (socket && connected) {
            socket.on(SocketEvents.START_GAME_4, ({ success, err, data }) => {
                setGameState(data?.gameState);
                setLobby((prev) => {
                    const newLobby = prev;
                    newLobby.activeGameInstanceId = data?.id;
                    return newLobby;
                });
            });

            socket.on(SocketEvents.GAME_STATE_UPDATE_4, ({ success, err, data }) => {
                console.log(data);
                setGameState(data?.gameState);
            });
        }

        return () => {
            socket.off(SocketEvents.START_GAME_4);
            socket.off(SocketEvents.GAME_STATE_UPDATE_4);
        }
    }, [socket, connected, setLobby]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log(lobby)
            if (socket && lobby?.activeGameInstanceId) {
                console.log("KeyDown: ", e)
                if (e.key === 'ArrowUp') {
                    socket.emit(SocketEvents.PLAYER_MOVE_4, {
                        action: "U",
                        lobbyId: lobby?.id,
                        playerId: currentUser?.id,
                        gameId: lobby.activeGameInstanceId
                    })
                }
                if (e.key === 'ArrowDown') {
                    socket.emit(SocketEvents.PLAYER_MOVE_4, {
                        action: "D",
                        lobbyId: lobby?.id,
                        playerId: currentUser?.id,
                        gameId: lobby.activeGameInstanceId
                    })
                }
                if (e.key === 'ArrowLeft') {
                    socket.emit(SocketEvents.PLAYER_MOVE_4, {
                        action: "L",
                        lobbyId: lobby?.id,
                        playerId: currentUser?.id,
                        gameId: lobby.activeGameInstanceId
                    })
                }
                if (e.key === 'ArrowRight') {
                    socket.emit(SocketEvents.PLAYER_MOVE_4, {
                        action: "R",
                        lobbyId: lobby?.id,
                        playerId: currentUser?.id,
                        gameId: lobby?.activeGameInstanceId
                    })
                }
                if (e.key === ' ') {
                    socket.emit(SocketEvents.PLAYER_MOVE_4, {
                        action: "S",
                        lobbyId: lobby?.id,
                        playerId: currentUser?.id,
                        gameId: lobby?.activeGameInstanceId
                    })
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentUser?.id, lobby?.id, socket, lobby]);

    return (
        <div className={styles.container}>
            <div className={styles.game}>
                {gameState.board.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.row}>
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={styles.cell}
                                style={{ backgroundColor: cell.color.hex }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.stats}></div>
        </div>
    );
}

export default LandIO;