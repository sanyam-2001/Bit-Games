import React, { useState } from 'react';
import styles from './Chat.module.css';

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
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Online <span className={styles.onlineCount}>{onlineUsers.filter(u => u.status !== 'offline').length}</span>
                </button>
            </div>

            {activeTab === 'chat' ? (
                <>
                    <div className={styles.messageList}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageItem} ${msg.isSystem ? styles.system : ''} ${msg.isCurrentUser ? styles.currentUser : ''}`}
                            >
                                {msg.isSystem ? (
                                    <p className={styles.systemMessage}>{msg.message}</p>
                                ) : (
                                    <>
                                        <div className={styles.messageHeader}>
                                            <span className={styles.username}>{msg.user}</span>
                                            <span className={styles.timestamp}>{msg.timestamp}</span>
                                        </div>
                                        <p className={styles.messageContent}>{msg.message}</p>
                                    </>
                                )}
                                <div className={styles.messageGlow}></div>
                            </div>
                        ))}
                    </div>

                    <form className={styles.chatInputForm} onSubmit={handleSendMessage}>
                        <input
                            className={styles.chatInput}
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className={styles.sendButton} type="submit">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </>
            ) : (
                <div className={styles.usersList}>
                    {onlineUsers.map((user) => (
                        <div key={user.id} className={styles.userItem}>
                            <div className={`${styles.statusIndicator} ${styles[user.status]}`}></div>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userStatus}>{user.status}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chat; 