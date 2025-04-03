import React, { useEffect } from 'react';
import styles from './Lobby.module.css';
import { SideMenu, GameCarousel, Chat } from '../../components/ui';
import { useSocket } from '../../context/SocketContext';
import { SocketEvents } from '../../enums/socketevents.enums';
import { useGlobal } from '../../context/GlobalContext';
const Lobby = () => {
    const { socket, connected } = useSocket();
    const { setLobby } = useGlobal();
    useEffect(() => {
        if (connected && socket) {
            socket.on(SocketEvents.USER_JOINED_LOBBY, ({ success, error, data }) => {
                const { lobby } = data;
                setLobby(lobby);
            });
        }
        return () => {
            if (socket) {
                socket.off(SocketEvents.USER_JOINED_LOBBY);
            }
        };
    }, [socket, setLobby, connected]);
    return (
        <div className={styles.lobbyContainer}>
            <div className={styles.glowOverlay}></div>
            <div className={styles.gridOverlay}></div>

            <div className={styles.leftSection}>
                <SideMenu />
            </div>

            <div className={styles.centerSection}>
                <div style={{ padding: '20px' }}>
                    {/* <h2 className={styles.sectionHeader}>Select Game</h2> */}
                    <GameCarousel />
                </div>

                <div style={{ padding: '20px' }}>
                    <button className={styles.playButton}>
                        Start Game
                        <div className={styles.buttonGlow}></div>
                    </button>
                </div>
            </div>

            <div className={styles.rightSection}>
                <Chat />
            </div>
        </div>
    );
};

export default Lobby;
