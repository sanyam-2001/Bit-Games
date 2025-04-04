import React, { useEffect, useState } from 'react';
import styles from './Lobby.module.css';
import { SideMenu, GameCarousel, Chat, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSocket } from '../../context/SocketContext';
import { SocketEvents } from '../../enums/socketevents.enums';
import { useGlobal } from '../../context/GlobalContext';
const Lobby = () => {
    const { socket, connected } = useSocket();
    const { lobby, setLobby, currentUser } = useGlobal();
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (connected && socket) {
            socket.on(SocketEvents.USER_JOINED_LOBBY, ({ success, error, data }) => {
                setLobby(data?.lobby);
            });
            socket.on(SocketEvents.LOBBY_UPDATED, ({ success, error, data }) => {
                console.log(data.lobby)
                setLobby(data?.lobby);
            });
        }
        return () => {
            if (socket) {
                socket.off(SocketEvents.USER_JOINED_LOBBY);
                socket.off(SocketEvents.LOBBY_UPDATED);
            }
        };
    }, [socket, setLobby, connected]);
    const handleReadyToggle = () => {
        if (socket) {
            socket.emit(SocketEvents.TOGGLE_PLAYER_STATUS, {
                lobbyId: lobby?.id,
                playerId: currentUser?.id
            });
        }
    }
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

                <div className={styles.buttonContainer}>
                    <PrimaryButton>Start Game</PrimaryButton>
                    <SecondaryButton onClick={handleReadyToggle}>{isReady ? "Unready" : "Ready"}</SecondaryButton>
                </div>
            </div>

            <div className={styles.rightSection}>
                <Chat />
            </div>
        </div>
    );
};

export default Lobby;
