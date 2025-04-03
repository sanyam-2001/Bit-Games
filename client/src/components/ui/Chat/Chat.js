import React, { useState } from 'react';
import './Chat.css';

// Sample messages for demonstration
const sampleMessages = [
  { id: 1, user: 'System', message: 'Welcome to Bit Games Lobby!', timestamp: '10:00', isSystem: true },
  { id: 2, user: 'NeonRider', message: 'Hey everyone! Who wants to play Cyber Race?', timestamp: '10:05' },
  { id: 3, user: 'QuantumGamer', message: 'I\'m in for a few races', timestamp: '10:06' },
  { id: 4, user: 'BitMaster', message: 'Just finishing a round of Laser Combat, will join soon', timestamp: '10:08' },
  { id: 5, user: 'DigitalNinja', message: 'Anyone tried the new Bit Puzzle update?', timestamp: '10:10' },
  { id: 6, user: 'CyberQueen', message: 'It\'s awesome! The new levels are mind-bending', timestamp: '10:12' },
];

// Sample online users
const onlineUsers = [
  { id: 1, name: 'NeonRider', status: 'online' },
  { id: 2, name: 'QuantumGamer', status: 'online' },
  { id: 3, name: 'BitMaster', status: 'online' },
  { id: 4, name: 'DigitalNinja', status: 'away' },
  { id: 5, name: 'CyberQueen', status: 'online' },
  { id: 6, name: 'CodeWarrior', status: 'busy' },
  { id: 7, name: 'SynthWave', status: 'online' },
  { id: 8, name: 'MatrixRunner', status: 'offline' },
];

const Chat = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'users'

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      user: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button 
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Online <span className="online-count">{onlineUsers.filter(u => u.status !== 'offline').length}</span>
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          <div className="message-list">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-item ${msg.isSystem ? 'system' : ''} ${msg.isCurrentUser ? 'current-user' : ''}`}
              >
                {msg.isSystem ? (
                  <p className="system-message">{msg.message}</p>
                ) : (
                  <>
                    <div className="message-header">
                      <span className="username">{msg.user}</span>
                      <span className="timestamp">{msg.timestamp}</span>
                    </div>
                    <p className="message-content">{msg.message}</p>
                  </>
                )}
                <div className="message-glow"></div>
              </div>
            ))}
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="send-button" type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </>
      ) : (
        <div className="users-list">
          {onlineUsers.map((user) => (
            <div key={user.id} className="user-item">
              <div className={`status-indicator ${user.status}`}></div>
              <span className="user-name">{user.name}</span>
              <span className="user-status">{user.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat; 