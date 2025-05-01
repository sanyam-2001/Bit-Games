import React, { useState, useRef, useEffect } from 'react';
import styles from './GameCarousel.module.css';
import { useGlobal } from '../../../context/GlobalContext';
// Sample game data - in a real app, this would come from an API

const GameCarousel = ({activeIndex, setActiveIndex}) => {
    const cardsContainerRef = useRef(null);
    const { gameList: games } = useGlobal();

    const nextGame = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % games.length);
    };

    const prevGame = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
    };
    // Scroll to the active card when it changes
    useEffect(() => {
        if (cardsContainerRef.current) {
            const cardWidth = 220; // card width + gap
            const containerWidth = cardsContainerRef.current.clientWidth;
            const scrollPosition = activeIndex * cardWidth - (containerWidth / 2) + (cardWidth / 2);

            // Only scroll if there are more cards than can fit in the container
            if (games.length * cardWidth > containerWidth) {
                cardsContainerRef.current.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeIndex, games.length]);

    const getPositionClass = (index) => {
        if (index === activeIndex) return styles.positionCenter;
        return index < activeIndex ? styles.positionLeft : styles.positionRight;
    };

    return (
        <div className={styles.gameCarouselContainer}>
            <div className={styles.carouselContainer}>
                <button className={`${styles.carouselButton} ${styles.left}`} onClick={prevGame}>
                    <i className="fas fa-chevron-left"></i>
                </button>

                <div className={styles.cardsContainer} ref={cardsContainerRef}>
                    <div className={styles.cardsWrapper}>
                        {games.map((game, index) => (
                            <div
                                key={game.id}
                                className={`${styles.gameCard} ${getPositionClass(index)}`}
                                style={{ backgroundImage: `url(${game.img})` }}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div className={styles.cardOverlay}></div>
                                <div className={styles.cardGlow}></div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{game.name}</h3>
                                    <div className={styles.cardPlayers}>
                                        {game.players.min === game.players.max
                                            ? `${game.players.min} players`
                                            : `${game.players.min}-${game.players.max} players`}
                                    </div>
                                    <p className={styles.cardDescription}>{game.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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