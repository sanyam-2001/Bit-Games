import React from 'react';
import styles from './Game.module.css';
import { Chat } from '../../components/ui';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigator } from '../../utils/navigator';

const Game = () => {
    const { lobby, currentUser } = useGlobal();
    const navigate = useNavigator();

    // If Lobby is null or lobby.id is null, redirect the page to /home
    React.useEffect(() => {
        if (!lobby || !lobby.id) {
            navigate('/home');
        }
    }, [lobby, navigate]);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.glowOverlay}></div>
            <div className={styles.gridOverlay}></div>

            <div className={styles.leftSection}>
                {/* Game content will go here */}
            </div>

            <div className={styles.rightSection}>
                <Chat />
            </div>
        </div>
    );
};

export default Game; 