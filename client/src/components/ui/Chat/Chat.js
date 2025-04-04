import React, { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';

// Sample messages for demonstration
const sampleMessages = [
    { id: 1, user: 'System', message: 'Welcome to Bit Games Lobby! Presented to you SR', timestamp: '10:00', isSystem: true },
];

const Chat = () => {
    const [messages, setMessages] = useState(sampleMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                <div className={styles.headerContent}>
                    <h2 className={styles.chatTitle}>Chat</h2>
                    <div className={styles.headerGlow}></div>
                </div>
            </div>
            
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
                <div ref={messagesEndRef} />
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
        </div>
    );
};

export default Chat; 