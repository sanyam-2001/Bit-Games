import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import styles from './VoiceChat.module.css';
import { useSocket } from '../../context/SocketContext';
import { SocketEvents } from '../../enums/socketevents.enums';
import { useGlobal } from '../../context/GlobalContext';
const VoiceChat = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVoiceChatEnabled, setIsVoiceChatEnabled] = useState(false);
    const localAudioStream = useRef(null);
    const { socket } = useSocket();
    const { lobby, currentUser } = useGlobal();

    const enableVoiceChat = useCallback(async () => {
        try {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            localAudioStream.current = userMediaStream;
            setIsVoiceChatEnabled(true);
            socket.emit(SocketEvents.JOIN_VOICE_REQUEST, {
                lobbyId: lobby.id,
                userId: currentUser.id,
            });
        } catch (error) {
            console.error('Error enabling voice chat:', error);
            setIsVoiceChatEnabled(false);
        }
    }, [lobby.id, currentUser.id, socket]);

    useEffect(() => {
        if (!isVoiceChatEnabled) {
            enableVoiceChat();
        }

        socket.on(SocketEvents.NEW_VOICE_USER_JOINED, (data) => {
            console.log("New Voice User Joined", data);
        });

        socket.on(SocketEvents.EXISTING_VOICE_USER_JOINED, (data) => {
            console.log("Existing Voice User Joined", data);
        });
        return () => {
            socket.off(SocketEvents.NEW_VOICE_USER_JOINED);
            socket.off(SocketEvents.EXISTING_VOICE_USER_JOINED);
        }
    }, [isVoiceChatEnabled, enableVoiceChat, socket]);

    return (
        <div>
            <button
                onClick={() => setIsMuted(prev => !prev)}
                className={`${styles.micButton} ${isMuted ? styles.muted : styles.unmuted}`}
            >
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
        </div>
    );
}

export default VoiceChat;