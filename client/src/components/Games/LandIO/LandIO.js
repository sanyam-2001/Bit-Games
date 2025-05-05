import React, { useEffect, useState, useCallback } from 'react';
import styles from './LandIO.module.css';
import { useGlobal } from '../../../context/GlobalContext';
import { useSocket } from '../../../context/SocketContext';
import { SocketEvents } from '../../../enums/socketevents.enums';
import { defaultLandIOState } from '../../../utils/DefaultState';

const LandIO = () => {
    const { lobby, currentUser, setLobby } = useGlobal();
    const { socket, connected } = useSocket();
    const [gameState, setGameState] = useState(defaultLandIOState);

    const handlePlayerMove = useCallback((action) => {
        if (socket && lobby?.activeGameInstanceId) {
            socket.emit(SocketEvents.PLAYER_MOVE_4, {
                action,
                lobbyId: lobby?.id,
                playerId: currentUser?.id,
                gameId: lobby.activeGameInstanceId
            });
        }
    }, [socket, lobby, currentUser]);

    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowUp':
                handlePlayerMove("U");
                break;
            case 'ArrowDown':
                handlePlayerMove("D");
                break;
            case 'ArrowLeft':
                handlePlayerMove("L");
                break;
            case 'ArrowRight':
                handlePlayerMove("R");
                break;
            case ' ':
                handlePlayerMove("S");
                break;
            default:
                break;
        }
    }, [handlePlayerMove]);

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
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const renderBoard = () => {
        return (
            <div className={styles.game}>
                <div className={styles.board}>
                    {gameState.board.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.row}>
                            {row.map((cell, colIndex) => {
                                const cellClasses = [styles.cell];

                                if (cell.state === 'EMPTY') {
                                    cellClasses.push(styles.cellEmpty);
                                } else if (cell.state === 'SEMI') {
                                    cellClasses.push(styles.cellSemi);
                                } else if (cell.state === 'OWNED') {
                                    cellClasses.push(styles.cellOwned);
                                }

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={cellClasses.join(' ')}
                                        style={{ backgroundColor: cell.color?.hex || '#444' }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {renderBoard()}
            <div className={styles.stats}></div>
        </div>
    );
}

export default LandIO;