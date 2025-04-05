import React, { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';
import { useSocket } from '../../../context/SocketContext';
import { SocketEvents as events } from '../../../enums/socketevents.enums';
import { v4 as uuid } from "uuid";
import { useGlobal } from '../../../context/GlobalContext';

const sampleMessages = [
    { id: 1, user: 'System', message: 'Welcome to Bit Games Lobby! Presented to you SR', timestamp: '10:00', isSystem: true }
];

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { socket, connected } = useSocket();

    const messagesEndRef = useRef(null);
    const {currentUser, lobby} = useGlobal();

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (connected && socket){
            socket.on(events.RECEIVE_CHAT_MESSAGE, ({ success, error, data }) => {
                console.log("Message Received:" , data);
                setMessages((prev)=>{
                    return [...prev, data];
                });

            });
        }

        return () => {
            if (socket) {
                socket.off(events.RECEIVE_CHAT_MESSAGE);
            }
        };
    },[socket]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: uuid(),
            sender: currentUser,
            message: newMessage,
        };

        socket.emit(events.SEND_CHAT_MESSAGE, { message, lobbyId: lobby.id });
    };

    const messageListMap = messages.map((msg) => {
       const isCurrentUser = msg.sender.id == currentUser.id;
       const isSystemMsg = false; 

       return (
       <div
            key={msg.id}
            className={`${styles.messageItem} ${isSystemMsg ? styles.system : ''} ${isCurrentUser? styles.currentUser : ''}`}
        >
            {isSystemMsg ? (
                <p className={styles.systemMessage}>{msg.message}</p>
            ) : (
                <>
                    <div className={styles.messageHeader}>
                        <span className={styles.username}>{msg.sender.name}</span>
                        <span className={styles.timestamp}>{msg.formattedTimestamp}</span>
                    </div>
                    <p className={styles.messageContent}>{msg.message}</p>
                </>
            )}
            <div className={styles.messageGlow}></div>
        </div>)
    });

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.headerContent}>
                    <h2 className={styles.chatTitle}>Chat</h2>
                    <div className={styles.headerGlow}></div>
                </div>
            </div>

            <div className={styles.messageList}>
                {messageListMap}
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