import React, { useState } from 'react';
import styles from './SideMenu.module.css';

const SideMenu = () => {
    // Mock data for players in lobby
    const playersInLobby = [
        { id: 1, name: 'Player1', status: 'Ready' },
        { id: 2, name: 'Player2', status: 'In Game' },
        { id: 3, name: 'Player3', status: 'Ready' },
        { id: 4, name: 'Player4', status: 'Away' },
        { id: 5, name: 'Player1', status: 'Ready' },
        { id: 6, name: 'Player2', status: 'In Game' },
        { id: 7, name: 'Player3', status: 'Ready' },
        { id: 8, name: 'Player4', status: 'Away' },
        { id: 15, name: 'Player1', status: 'Ready' },
        { id: 16, name: 'Player2', status: 'In Game' },
        { id: 17, name: 'Player3', status: 'Ready' },
        { id: 18, name: 'Player4', status: 'Away' },
    ];

    // Mock lobby ID
    const lobbyId = "LOBBY-123456";

    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(lobbyId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className={styles.menuContainer}>
            <div className={styles.logoSection}>
                <h1 className={`${styles.logoText} ${styles.pixelated}`}>BIT GAMES</h1>
            </div>

            <div className={styles.sectionContainer}>
                <h3 className={styles.sectionTitle}>Players in Lobby</h3>
                <ul className={styles.playerList}>
                    {playersInLobby.map(player => (
                        <li key={player.id} className={styles.playerItem}>
                            <span className={styles.playerName}>{player.name}</span>
                            <span className={`${styles.playerStatus} ${styles[player.status.toLowerCase()]}`}>
                                {player.status}
                            </span>
                        </li>
                    ))}
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