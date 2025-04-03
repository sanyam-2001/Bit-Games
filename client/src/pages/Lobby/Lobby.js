import React from 'react';
import styles from './Lobby.module.css';
import { SideMenu, GameCarousel, Chat } from '../../components/ui';

const Lobby = () => {
    return (
        <div className={styles.lobbyContainer}>
            <div className={styles.glowOverlay}></div>
            <div className={styles.gridOverlay}></div>

            <div className={styles.leftSection}>
                <SideMenu />
            </div>

            <div className={styles.centerSection}>

                <div className={styles.gameSection}>
                    <h2 className={styles.sectionHeader}>Select Game</h2>
                    <GameCarousel />
                </div>

                <div className={styles.bottomSection}>
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
