import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import ParticleBackground from '../ParticleBackground/ParticleBackground';

const LandingPage = () => {
    const [isParticleActive, setIsParticleActive] = useState(false);

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
                <button className="cta-button">PLAY NOW</button>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="feature-card" data-animation-delay="0">
                    <div className="light-spot"></div>
                    <div className="feature-icon">🎮</div>
                    <h3 className="feature-title">Retro Classics</h3>
                    <p className="feature-desc">
                        Dive into our collection of carefully preserved retro games from the 80s and 90s.
                    </p>
                </div>
                <div className="feature-card" data-animation-delay="1">
                    <div className="light-spot"></div>
                    <div className="feature-icon">🕹️</div>
                    <h3 className="feature-title">Modern Pixels</h3>
                    <p className="feature-desc">
                        Experience new indie games created with classic pixel art aesthetics.
                    </p>
                </div>
                <div className="feature-card" data-animation-delay="2">
                    <div className="light-spot"></div>
                    <div className="feature-icon">🏆</div>
                    <h3 className="feature-title">Tournaments</h3>
                    <p className="feature-desc">
                        Compete in retro gaming tournaments and climb the global leaderboards.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage; 