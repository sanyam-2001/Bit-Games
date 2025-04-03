import React, { useState } from 'react';
import styles from './GameCarousel.module.css';

// Sample game data - in a real app, this would come from an API
const games = [
    {
        id: 1,
        title: 'Tic Tac Toe',
        image: '/ticTacToe.png',
        players: '2 players',
        description: 'High-speed futuristic racing game',
    },
    {
        id: 2,
        title: 'Shazam',
        image: '/shazam.png',
        players: '2-8 players',
        description: 'Battle arena with neon weapons',
    },
    {
        id: 4,
        title: 'JKLM',
        image: '/jklm.png',
        players: '2-8 players',
        description: 'Race in procedurally generated tracks',
    }
];

const GameCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextGame = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % games.length);
    };

    const prevGame = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
    };

    // Calculate indices for visible cards
    const getVisibleIndices = () => {
        const indices = [];
        for (let i = -1; i <= 1; i++) {
            indices.push((activeIndex + i + games.length) % games.length);
        }
        return indices;
    };

    const getPositionClass = (position) => {
        if (position === -1) return styles.positionLeft;
        if (position === 0) return styles.positionCenter;
        if (position === 1) return styles.positionRight;
        return '';
    };

    const visibleIndices = getVisibleIndices();

    return (
        <div className={styles.gameCarouselContainer}>
            <div className={styles.carouselContainer}>
                <button className={`${styles.carouselButton} ${styles.left}`} onClick={prevGame}>
                    <i className="fas fa-chevron-left"></i>
                </button>

                <div className={styles.cardsContainer}>
                    {visibleIndices.map((index, i) => (
                        <div
                            key={games[index].id}
                            className={`${styles.gameCard} ${getPositionClass(i - 1)}`}
                            style={{ backgroundImage: `url(${games[index].image})` }}
                        >
                            <div className={styles.cardOverlay}></div>
                            <div className={styles.cardGlow}></div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{games[index].title}</h3>
                                <div className={styles.cardPlayers}>{games[index].players}</div>
                                <p className={styles.cardDescription}>{games[index].description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className={`${styles.carouselButton} ${styles.right}`} onClick={nextGame}>
                    <i className="fas fa-chevron-right"></i>
                </button>

                <div className={styles.gameIndicators}>
                    {games.map((game, index) => (
                        <div
                            key={game.id}
                            className={`${styles.gameIndicator} ${index === activeIndex ? styles.active : ''}`}
                            onClick={() => setActiveIndex(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameCarousel; 