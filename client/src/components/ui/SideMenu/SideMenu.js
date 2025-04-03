import React from 'react';
import './SideMenu.css';

const SideMenu = ({ isOpen }) => {
  return (
    <div className={`menu-container ${!isOpen ? 'hidden' : ''}`}>
      <div className="menu-header">
        <h2 className="menu-title">Menu</h2>
      </div>
      
      <ul className="menu-content">
        <li className="menu-item active">
          <i className="menu-icon fas fa-gamepad"></i>
          <span className="menu-text">Games</span>
          <div className="glow-line"></div>
        </li>
        
        <li className="menu-item">
          <i className="menu-icon fas fa-user"></i>
          <span className="menu-text">Profile</span>
        </li>
        
        <li className="menu-item">
          <i className="menu-icon fas fa-users"></i>
          <span className="menu-text">Friends</span>
        </li>
        
        <li className="menu-item">
          <i className="menu-icon fas fa-trophy"></i>
          <span className="menu-text">Leaderboard</span>
        </li>
        
        <li className="menu-item">
          <i className="menu-icon fas fa-cog"></i>
          <span className="menu-text">Settings</span>
        </li>
      </ul>
      
      <div className="menu-footer">
        <button className="logout-button">
          <i className="menu-icon fas fa-sign-out-alt"></i>
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu; 