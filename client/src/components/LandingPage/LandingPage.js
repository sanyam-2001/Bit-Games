import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { useNavigator } from '../../utils/navigator';
import './LandingPage.css';
import ParticleBackground from '../ParticleBackground/ParticleBackground';
import PrimaryButton from '../ui/PrimaryButton/PrimaryButton';
const LandingPage = () => {
    const [isParticleActive, setIsParticleActive] = useState(false);
    const navigate = useNavigator();

    // Feature cards data
    const featureCards = [
        {
            id: 0,
            icon: '🎮',
            title: 'Retro Classics',
            description: 'Dive into our collection of carefully preserved retro games from the 80s and 90s.'
        },
        {
            id: 1,
            icon: '🕹️',
            title: 'Modern Pixels',
            description: 'Experience new indie games created with classic pixel art aesthetics.'
        },
        {
            id: 2,
            icon: '🏆',
            title: 'Tournaments',
            description: 'Compete in retro gaming tournaments and climb the global leaderboards.'
        }
    ];

    // Enable particle interaction when page is clicked
    useEffect(() => {
        const handleClick = () => {
            if (!isParticleActive) {
                setIsParticleActive(true);

                // Add active class to particle canvas
                const canvas = document.querySelector('.particle-canvas');
                if (canvas) canvas.classList.add('active');
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [isParticleActive]);

    // Handler function for navigation
    const handlePlayNow = () => {
        navigate('/home');
    };

    return (
        <div className="landing-container">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Flowing neon streams */}
            <div className="neon-stream left">
                <div className="stream-content"></div>
            </div>
            <div className="neon-stream right">
                <div className="stream-content"></div>
            </div>

            {/* SVG Filters for Effects */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <filter id="pixel-filter">
                    <feFlood x="4" y="4" height="2" width="2" />
                    <feComposite width="10" height="10" />
                    <feTile result="a" />
                    <feComposite in="SourceGraphic" in2="a" operator="in" />
                    <feMorphology operator="dilate" radius="1" />
                </filter>
            </svg>

            {/* Header */}
            <header className="header">
                <div className="logo-container">
                    <h1 className="logo-text pixelated">BIT GAMES</h1>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">ENTER THE GRID</h1>
                <p className="hero-subtitle">
                    Experience real-time multiplayer gaming like never before.
                    Join thousands of players in our neon-fueled digital arena.
                </p>
                <PrimaryButton onClick={handlePlayNow}>PLAY NOW</PrimaryButton>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                {featureCards.map((card) => (
                    <div className="feature-card" data-animation-delay={card.id} key={card.id}>
                        <div className="light-spot"></div>
                        <div className="feature-icon">{card.icon}</div>
                        <h3 className="feature-title">{card.title}</h3>
                        <p className="feature-desc">
                            {card.description}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default LandingPage; 