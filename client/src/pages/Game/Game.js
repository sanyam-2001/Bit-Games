import React from 'react';
import styles from './Game.module.css';
import { Chat } from '../../components/ui';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigator } from '../../utils/navigator';
import TicTacToe from '../../components/Games/TicTacToe/TicTacToe';

// Placeholder components for other games
// These should be replaced with actual game components when they are developed
const Shazam = () => (
    <div>
        <h1>Shazam Game</h1>
        <p>Music Guessing Game</p>
    </div>
);

const JKLM = () => (
    <div>
        <h1>JKLM Game</h1>
        <p>Guess words with a twist</p>
    </div>
);

const Game = () => {
    const { lobby, currentUser, gameList } = useGlobal();
    const navigate = useNavigator();

    // If Lobby is null or lobby.id is null, redirect the page to /home
    React.useEffect(() => {
        if (!lobby || !lobby.id) {
            navigate('/home');
        }
    }, [lobby, navigate]);

    // Render the appropriate game component based on gameId in lobby
    const renderGame = () => {
        if (!lobby || !lobby.gameId) {
            return <div>No game selected</div>;
        }

        switch (lobby.gameId) {
            case 1: // TicTacToe
                return <TicTacToe />;
            case 2: // Shazam
                return <Shazam />;
            case 3: // JKLM
                return <JKLM />;
            default:
                const selectedGame = gameList.find(game => game.id === lobby.gameId);
                return (
                    <div>
                        <h2>Unknown Game</h2>
                        {selectedGame ? (
                            <p>Game: {selectedGame.name}</p>
                        ) : (
                            <p>Game ID: {lobby.gameId}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.glowOverlay}></div>
            <div className={styles.gridOverlay}></div>

            <div className={styles.leftSection}>
                {renderGame()}
            </div>

            <div className={styles.rightSection}>
                <Chat />
            </div>
        </div>
    );
};

export default Game; 