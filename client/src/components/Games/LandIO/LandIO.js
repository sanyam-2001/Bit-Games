import React, { useEffect, useState } from 'react';
import styles from './LandIO.module.css';
import { useGlobal } from '../../../context/GlobalContext';
import { useSocket } from '../../../context/SocketContext';
import { SocketEvents } from '../../../enums/socketevents.enums';
import { defaultLandIOState } from '../../../utils/DefaultState';
const LandIO = () => {
    const { lobby, currentUser } = useGlobal();
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
            });
        }
    }, [socket, connected]);


    return (
        <div className={styles.container}>
            <div
                className={styles.game}
                style={{
                    gridTemplateColumns: `repeat(${gameState?.boardSize}, 1fr)`
                }}
            >
                {gameState?.board?.map((row, rowIdx) =>
                    row.map((cell, colIdx) => (
                        <div
                            key={`${rowIdx}-${colIdx}`}
                            className={styles.cell}
                            style={{ background: cell.color.hex }}
                        >
                            {/* Optionally, you can show status or player info here */}
                        </div>
                    ))
                )}
            </div>
            <div className={styles.stats}></div>
        </div>
    );
}

export default LandIO;