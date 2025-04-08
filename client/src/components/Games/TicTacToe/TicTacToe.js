import React, { useState, useRef } from 'react';
import styles from './TicTacToe.module.css';
const BlueCupImg = '/Blue_cup.png';
const PinkCupImg = '/Pink_cup.png';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('blue');
    const [selectedCup, setSelectedCup] = useState(null);
    const [blueCups, setBlueCups] = useState([5, 4, 3, 2, 1]);
    const [pinkCups, setPinkCups] = useState([5, 4, 3, 2, 1]);
    const dragItem = useRef(null);
    
    const handleDragStart = (player, size) => {
        dragItem.current = { player, size };
        setSelectedCup(size);
    };
    
    const handleDragOver = (e, index) => {
        e.preventDefault();
    };
    
    const handleDrop = (e, index) => {
        e.preventDefault();
        if (!dragItem.current) return;
        
        const { player, size } = dragItem.current;
        const boardCopy = [...board];
        
        // Check if the cell is empty or if the cup being placed is larger than the existing cup
        const cellContent = boardCopy[index];
        if (!cellContent || (cellContent && cellContent.size < size)) {
            // Remove the cup from the player's available cups
            if (player === 'blue') {
                if (!blueCups.includes(size)) return;
                setBlueCups(blueCups.filter(cup => cup !== size));
            } else {
                if (!pinkCups.includes(size)) return;
                setPinkCups(pinkCups.filter(cup => cup !== size));
            }
            
            // Place the cup on the board
            boardCopy[index] = { player, size };
            setBoard(boardCopy);
            setCurrentPlayer(currentPlayer === 'blue' ? 'pink' : 'blue');
            
            // Check for win
            checkWinner(boardCopy);
        }
        
        setSelectedCup(null);
        dragItem.current = null;
    };
    
    const checkWinner = (boardState) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] && boardState[b] && boardState[c] &&
                boardState[a].player === boardState[b].player && 
                boardState[a].player === boardState[c].player) {
                alert(`${boardState[a].player.toUpperCase()} player wins!`);
                resetGame();
                return;
            }
        }
        
        // Check for a draw
        if (boardState.every(cell => cell !== null)) {
            alert("It's a draw!");
            resetGame();
        }
    };
    
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setBlueCups([5, 4, 3, 2, 1]);
        setPinkCups([5, 4, 3, 2, 1]);
        setCurrentPlayer('blue');
    };
    
    // Cup component with proper sizing and image
    const CupComponent = ({ player, size, draggable, onDragStart }) => {
        const cupImage = player === 'blue' ? BlueCupImg : PinkCupImg;
        const glowClass = player === 'blue' ? styles.blueGlow : styles.pinkGlow;
        
        return (
            <div 
                className={`${styles.cupWrapper} ${glowClass}`}
                style={{ transform: `scale(${size * 0.15 + 0.4})` }}
                draggable={draggable}
                onDragStart={onDragStart}
            >
                <img 
                    src={cupImage} 
                    alt={`${player} cup`} 
                    className={styles.cupImage} 
                />
            </div>
        );
    };
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Neon Cup Tac Toe</h1>
            
            <div className={styles.gameContainer}>
                <div className={styles.playerSection}>
                    <h2 className={`${styles.playerTitle} ${styles.blueText}`}>Blue Player</h2>
                    <div className={styles.cupsContainer}>
                        {blueCups.map((size) => (
                            <CupComponent
                                key={`blue-${size}`}
                                player="blue"
                                size={size}
                                draggable={currentPlayer === 'blue'}
                                onDragStart={() => handleDragStart('blue', size)}
                            />
                        ))}
                    </div>
                </div>
                
                <div className={styles.board}>
                    {board.map((cell, index) => (
                        <div 
                            key={index}
                            className={styles.cell}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {cell && (
                                <CupComponent
                                    player={cell.player}
                                    size={cell.size}
                                    draggable={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className={styles.playerSection}>
                    <h2 className={`${styles.playerTitle} ${styles.pinkText}`}>Pink Player</h2>
                    <div className={styles.cupsContainer}>
                        {pinkCups.map((size) => (
                            <CupComponent
                                key={`pink-${size}`}
                                player="pink"
                                size={size}
                                draggable={currentPlayer === 'pink'}
                                onDragStart={() => handleDragStart('pink', size)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className={styles.turnIndicator}>
                <p>Current turn: <span className={currentPlayer === 'blue' ? styles.blueText : styles.pinkText}>
                    {currentPlayer.toUpperCase()} Player
                </span></p>
            </div>
            
            <button className={styles.resetButton} onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
};

export default TicTacToe;