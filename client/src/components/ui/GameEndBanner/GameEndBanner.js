import React, { useEffect, useState } from 'react';
import styles from './GameEndBanner.module.css';
import Confetti from 'react-confetti';
import { WinStatus } from '../../../enums/WinStatus.enum';
import Button from '../Button/Button';
import { useGlobal } from '../../../context/GlobalContext.js';

const GameEndBanner = ({ state, onClose, visible, restartGame, backToTheLobby }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const { lobby, currentUser } = useGlobal();
    useEffect(() => {
        if (visible) {
            // Play the appropriate sound
            const audio = new Audio(state === WinStatus.WIN ? '/game_audios/win.mp3' : '/game_audios/lose.mp3');
            audio.volume = 0.5;
            audio.play();

            // Show confetti if it's a win
            if (state === WinStatus.WIN) {
                setShowConfetti(true);
            }
        } else {
            setShowConfetti(false);
        }
    }, [visible, state]);

    if (!visible) return null;

    const renderRestartButton = () => {
        const isAdmin = lobby?.admin === currentUser?.id;
        if (isAdmin)
            return (
                <Button variant='secondary' fullWidth={true} onClick={() => restartGame()}>
                    New Game?
                </Button>
            );
        else return null;
    }

    const renderBackToTheLobbyButton = () =>{
        const isAdmin = lobby?.admin === currentUser?.id;
        if (isAdmin)
            return (
                <Button variant='secondary' fullWidth={true} onClick={() => backToTheLobby()}>
                    Back to the lobby
                </Button>
            );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className={`${styles.banner} ${state === WinStatus.WIN ? styles.win : styles.lose}`}>
                {state === WinStatus.WIN && <h1>YOU WIN!</h1>}
                {state === WinStatus.DRAW && <h1>IT'S A DRAW!</h1>}
                {state === WinStatus.LOSE && <h1>YOU LOSE</h1>}
            </div>

            <div className={styles.restartButton}>
                {renderRestartButton()}
                {renderBackToTheLobbyButton()}
            </div>\

        </div>
    );
};

export default GameEndBanner;
