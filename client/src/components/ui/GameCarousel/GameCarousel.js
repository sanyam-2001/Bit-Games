import React, { useState } from 'react';
import styles from './GameCarousel.module.css';

// Sample game data - in a real app, this would come from an API
const games = [
    {
        id: 1,
        title: 'Cyber Race',
        image: 'https://via.placeholder.com/200x120/0A0E17/08F7FE?text=Cyber+Race',
        players: '2-8 players',
        description: 'High-speed futuristic racing game',
    },
    {
        id: 2,
        title: 'Neon Fighters',
        image: 'https://via.placeholder.com/200x120/0A0E17/FE53BB?text=Neon+Fighters',
        players: '2-4 players',
        description: 'Battle arena with neon weapons',
    },
    {
        id: 3,
        title: 'Bit Puzzle',
        image: 'https://via.placeholder.com/200x120/0A0E17/09FBD3?text=Bit+Puzzle',
        players: '1-2 players',
        description: 'Mind-bending digital puzzles',
    },
    {
        id: 4,
        title: 'Virtual Racer',
        image: 'https://via.placeholder.com/200x120/0A0E17/08F7FE?text=Virtual+Racer',
        players: '1-4 players',
        description: 'Race in procedurally generated tracks',
    },
    {
        id: 5,
        title: 'Laser Combat',
        image: 'https://via.placeholder.com/200x120/0A0E17/FE53BB?text=Laser+Combat',
        players: '2-16 players',
        description: 'Team-based laser tag simulation',
    },
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
        <div className={styles.carouselContainer}>
            <button className={`${styles.carouselButton} ${styles.left}`} onClick={prevGame}>
                <i className="fas fa-chevron-left"></i>
            </button>

            <div className={styles.cardsContainer}>
                {visibleIndices.map((index, i) => (
                    <div
                        key={games[index].id}
                        className={`${styles.gameCard} ${getPositionClass(i - 1)}`}
                    >
                        <img className={styles.cardImage} src={games[index].image} alt={games[index].title} />
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
    );
};

export default GameCarousel; 