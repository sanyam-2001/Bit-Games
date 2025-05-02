import React, { useEffect, useState } from 'react';
import styles from './Lobby.module.css';
import { SideMenu, GameCarousel, Chat, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSocket } from '../../context/SocketContext';
import { SocketEvents } from '../../enums/socketevents.enums';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigator } from '../../utils/navigator';
import { PlayerStatus } from '../../enums/PlayerStatus.enum';
import VoiceChat from '../../components/VoiceChat/VoiceChat';
import { showToast } from "../../utils/toast";

const Lobby = () => {
    const { socket, connected } = useSocket();
    const { lobby, setLobby, currentUser, gameList } = useGlobal();
    const isReady =
        lobby?.players?.find((player) => player.id === currentUser?.id)?.status ===
        PlayerStatus.READY || false;
    const amIAdmin = lobby?.admin === currentUser?.id;
    const isEveryoneReady = lobby?.players?.every(
        (player) => player.status === PlayerStatus.READY
    );
    const [activeIndex, setActiveIndex] = useState(0);

    const navigate = useNavigator();

    useEffect(() => {
        if (!lobby || !lobby.id) {
            navigate("/home");
        }
    }, [lobby, navigate]);

    useEffect(() => {
        if (connected && socket) {
            socket.on(SocketEvents.USER_JOINED_LOBBY, ({ success, error, data }) => {
                setLobby(data?.lobby);
            });

            socket.on(SocketEvents.LOBBY_UPDATED, ({ success, error, data }) => {
                setLobby(data?.lobby);
            });

            socket.on(SocketEvents.NAVIGATE_TO_GAME, ({ success, error, data }) => {
                setLobby(data?.lobby);
                navigate("/game");
            });
        }

        return () => {
            if (socket) {
                socket.off(SocketEvents.USER_JOINED_LOBBY);
                socket.off(SocketEvents.LOBBY_UPDATED);
                socket.off(SocketEvents.NAVIGATE_TO_GAME);
            }
        };
    }, [socket, setLobby, connected, navigate]);

    const handleReadyToggle = () => {
        if (socket) {
            socket.emit(SocketEvents.TOGGLE_PLAYER_STATUS, {
                lobbyId: lobby?.id,
                playerId: currentUser?.id,
            });
        }
    };
    const handleStartGame = () => {
        if (socket) {
            console.log("Starting game");
            const selectedGame = gameList[activeIndex];
            const gameId = selectedGame.id;

            if (
                false
                // selectedGame.players.min > lobby.players.length ||
                // selectedGame.players.max < lobby.players.length
            ) {
                showToast.warning(
                    `${selectedGame.name} requires ${selectedGame.players.min} to ${selectedGame.players.max} players`
                );
                return;
            }

            socket.emit(SocketEvents.NAVIGATE_TO_GAME, {
                lobbyId: lobby?.id,
                gameId,
            });
        }
    };

    return (
        <div className={styles.lobbyContainer}>
            <div className={styles.glowOverlay}></div>
            <div className={styles.gridOverlay}></div>

            <div className={styles.leftSection}>
                <SideMenu />
            </div>

            <div className={styles.centerSection}>
                <div style={{ padding: "20px" }}>
                    {/* <h2 className={styles.sectionHeader}>Select Game</h2> */}
                    <GameCarousel
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    {amIAdmin && (
                        <PrimaryButton
                            disabled={!isEveryoneReady}
                            onClick={handleStartGame}
                        >
                            Start Game
                        </PrimaryButton>
                    )}
                    <SecondaryButton onClick={handleReadyToggle}>
                        {isReady ? "Unready" : "Ready"}
                    </SecondaryButton>
                    <VoiceChat />
                </div>
            </div>

            <div className={styles.rightSection}>
                <Chat />
            </div>
        </div>
    );
};

export default Lobby;
