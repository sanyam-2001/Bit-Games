import React, { useEffect, useState } from 'react';
import styles from './GameEndBanner.module.css';
import Confetti from 'react-confetti';
import { WinStatus } from '../../../enums/WinStatus.enum';

const GameEndBanner = ({ state, onClose, visible }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (visible) {
      // Play the appropriate sound
      const audio = new Audio(state === WinStatus.WIN ? '/game_audios/win.mp3' : '/game_audios/lose.mp3');
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className={`${styles.banner} ${state === WinStatus.WIN  ? styles.win : styles.lose}`}>
        {state === WinStatus.WIN && <h1>YOU WIN!</h1> }
        {state === WinStatus.DRAW && <h1>IT'S A DRAW!</h1> }
        {state === WinStatus.LOSE && <h1>YOU LOSE</h1> }
      </div>
    </div>
  );
};

export default GameEndBanner;
