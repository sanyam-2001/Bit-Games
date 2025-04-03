import React, { useState } from 'react';
import './Lobby.css';
import { SideMenu, GameCarousel, Chat } from '../../components/ui';

const Lobby = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="lobby-container">
      <div className="glow-overlay"></div>
      <div className="grid-overlay"></div>
      
      <div className={`left-section ${!isMenuOpen ? 'closed' : ''}`}>
        <SideMenu isOpen={isMenuOpen} />
      </div>
      
      <div className="center-section">
        <div className="logo-section">
          <h1 className="logo-text">BIT GAMES</h1>
          <p className="tagline">Enter the Digital Arena</p>
        </div>
        
        <div className="game-section">
          <h2 className="section-header">Select Game</h2>
          <GameCarousel />
        </div>
        
        <div className="bottom-section">
          <button className="play-button">
            Start Game
            <div className="button-glow"></div>
          </button>
        </div>
      </div>
      
      <div className="right-section">
        <Chat />
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}></div>
      </div>
    </div>
  );
};

export default Lobby;
