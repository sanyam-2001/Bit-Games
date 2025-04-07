import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import styles from './VoiceChat.module.css';
import { useSocket } from '../../context/SocketContext';
import { SocketEvents } from '../../enums/socketevents.enums';
import { useGlobal } from '../../context/GlobalContext';
import { getPeerConnectionConfig, Peer } from '../../utils/voice';
const VoiceChat = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVoiceChatEnabled, setIsVoiceChatEnabled] = useState(false);
    const localAudioStream = useRef(null);
    const { socket } = useSocket();
    const { lobby, currentUser } = useGlobal();

    const peers = useRef({});

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

    const createPeerConnection = useCallback((socketId, userId) => {
        const peerConnection = new RTCPeerConnection(getPeerConnectionConfig());

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit(SocketEvents.SEND_ICE_CANDIDATE, {
                    candidate: event.candidate,
                    receiverId: socketId,
                    senderId: socket.id,
                    lobbyId: lobby.id,
                });
            }
        };

        peerConnection.ontrack = (event) => {
            // Handle receiving remote audio stream
            if (event.streams && event.streams[0]) {
                const audioElement = document.getElementById(`audio-${socketId}`);
                if (audioElement) {
                    audioElement.srcObject = event.streams[0];
                } else {
                    // Create a new audio element if it doesn't exist
                    const newAudioElement = document.createElement('audio');
                    newAudioElement.id = `audio-${socketId}`;
                    newAudioElement.autoplay = true;
                    newAudioElement.srcObject = event.streams[0];
                    document.body.appendChild(newAudioElement); // Or append to a specific container
                }
            }
        };

        if (localAudioStream.current) {
            localAudioStream.current.getTracks().forEach(track => peerConnection.addTrack(track, localAudioStream.current));
        }
        const peer = new Peer(socketId, userId, peerConnection);
        return peer;

    }, [socket, lobby.id]);

    const createAndSendOffer = useCallback(async (socketId, userId) => {
        if (peers.current[socketId]) {
            return;
        }
        const peer = createPeerConnection(socketId, userId);
        peers.current[socketId] = peer;
        try {
            const offer = await peer.peerConnection.createOffer();
            await peer.peerConnection.setLocalDescription(offer);
            socket.emit(SocketEvents.SEND_OFFER, { offer, receiverId: socketId, senderId: socket.id, lobbyId: lobby.id });
        } catch (error) {
            console.error('Error creating and sending offer:', error);
        }

    }, [createPeerConnection, socket, lobby.id]);


    useEffect(() => {
        if (!isVoiceChatEnabled) {
            enableVoiceChat();
        }

        socket.on(SocketEvents.NEW_VOICE_USER_JOINED, (data) => {
            console.log("New Voice User Joined", data);
            const { socketId, userId } = data;
            createAndSendOffer(socketId, userId);
        });

        socket.on(SocketEvents.EXISTING_VOICE_USER_JOINED, (data) => {
            console.log("Existing Voice User Joined", data);
            const { socketId, userId } = data;
            if (socketId !== socket.id && !peers.current[socketId]) {
                createAndSendOffer(socketId, userId);
            }
        });

        socket.on(SocketEvents.RECEIVE_ICE_CANDIDATE, (data) => {
            const { candidate, senderId } = data;
            if (peers.current[senderId]) {
                peers.current[senderId].pendingCandidates.push(candidate);
            }
        });

        socket.on(SocketEvents.RECEIVE_OFFER, (data) => {
            console.log("Received Offer", data);
            const { offer, senderId } = data;

        });


        return () => {
            socket.off(SocketEvents.NEW_VOICE_USER_JOINED);
            socket.off(SocketEvents.EXISTING_VOICE_USER_JOINED);
            socket.off(SocketEvents.RECEIVE_ICE_CANDIDATE);
            socket.off(SocketEvents.RECEIVE_OFFER);
        }
    }, [isVoiceChatEnabled, enableVoiceChat, socket, createAndSendOffer]);

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