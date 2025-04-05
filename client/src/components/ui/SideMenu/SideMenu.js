import React, { useState, useEffect } from 'react';
import styles from './SideMenu.module.css';
import { useGlobal } from '../../../context/GlobalContext';
import { PlayerStatus } from '../../../enums/PlayerStatus.enum';

const SideMenu = () => {
    const { lobby } = useGlobal();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (lobby?.players) {
            setPlayers(lobby.players);
        }
    }, [lobby?.players]);

    // Mock lobby ID
    const lobbyId = lobby?.id;

    const [copySuccess, setCopySuccess] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(lobbyId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };
    const PlayerListComponent = players.map(player => {
        const playerStatusClass = player?.status?.toLowerCase() || PlayerStatus.NOT_READY.toLowerCase();
        return (
            <li key={player.id} className={styles.playerItem}>
                <span className={styles.playerName}>{player.name}</span>
                <span className={`${styles.playerStatus} ${styles[playerStatusClass]}`}>
                    {player.status}
                </span>
            </li>
        )
    })
    return (
        <div className={styles.menuContainer}>
            <div className={styles.logoSection}>
                <h1 className={`${styles.logoText} ${styles.pixelated}`}>BIT GAMES</h1>
            </div>

            <div className={styles.sectionContainer}>
                <h3 className={styles.sectionTitle}>Players in Lobby</h3>
                <ul className={styles.playerList}>
                    {PlayerListComponent}
                </ul>
            </div>

            <div className={styles.lobbyIdSection}>
                <div className={styles.lobbyIdContainer}>
                    <span className={styles.lobbyIdLabel}>Lobby ID:</span>
                    <span className={styles.lobbyId}>{lobbyId}</span>
                </div>
                <button
                    className={styles.copyButton}
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                >
                    {copySuccess ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export default SideMenu; 