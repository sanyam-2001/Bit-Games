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
    const isOfferer = useRef(false);

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
            if (event.streams && event.streams[0]) {
                const audioElement = document.getElementById(`audio-${socketId}`);
                if (audioElement) {
                    audioElement.srcObject = event.streams[0];
                } else {
                    const newAudioElement = document.createElement('audio');
                    newAudioElement.id = `audio-${socketId}`;
                    newAudioElement.autoplay = true;
                    newAudioElement.srcObject = event.streams[0];
                    document.body.appendChild(newAudioElement);
                }
            }
        };

        if (localAudioStream.current) {
            localAudioStream.current.getTracks().forEach(track =>
                peerConnection.addTrack(track, localAudioStream.current)
            );
        }

        return new Peer(socketId, userId, peerConnection);
    }, [socket, lobby.id]);

    const createAndSendOffer = useCallback(async (socketId, userId) => {
        if (peers.current[socketId] || !isOfferer.current) {
            return;
        }

        const peer = createPeerConnection(socketId, userId);
        peers.current[socketId] = peer;

        try {
            const offer = await peer.peerConnection.createOffer();
            await peer.peerConnection.setLocalDescription(offer);

            socket.emit(SocketEvents.SEND_OFFER, {
                offer,
                receiverId: socketId,
                senderId: socket.id,
                lobbyId: lobby.id
            });
        } catch (error) {
            console.error('Error creating and sending offer:', error);
        }
    }, [createPeerConnection, socket, lobby.id]);

    const handleReceiveOffer = useCallback(async (data) => {
        const { offer, senderId } = data;

        if (peers.current[senderId] || isOfferer.current) {
            return;
        }

        const peer = createPeerConnection(senderId, currentUser.id);
        peers.current[senderId] = peer;

        try {
            await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.peerConnection.createAnswer();
            await peer.peerConnection.setLocalDescription(answer);

            // Process any pending candidates after setting remote description
            await peer.processPendingCandidates();

            socket.emit(SocketEvents.SEND_ANSWER, {
                answer,
                receiverId: senderId,
                senderId: socket.id,
                lobbyId: lobby.id
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [createPeerConnection, socket, currentUser.id, lobby.id]);

    const handleReceiveIceCandidate = useCallback(async (data) => {
        const { candidate, senderId } = data;

        if (peers.current[senderId]) {
            try {
                await peers.current[senderId].peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            } catch (error) {
                // If adding ICE candidate fails, add it to the queue
                peers.current[senderId].addPendingCandidate(candidate);
            }
        }
    }, []);

    const handleReceiveAnswer = useCallback(async (data) => {
        const { answer, senderId } = data;

        if (peers.current[senderId]) {
            try {
                await peers.current[senderId].peerConnection.setRemoteDescription(
                    new RTCSessionDescription(answer)
                );
                // After setting remote description, process any pending candidates
                await peers.current[senderId].processPendingCandidates();
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (!isVoiceChatEnabled) {
            enableVoiceChat();
        }

        socket.on(SocketEvents.NEW_VOICE_USER_JOINED, (data) => {
            const { socketId, userId, isOfferer: shouldBeOfferer } = data;
            isOfferer.current = shouldBeOfferer;
            if (shouldBeOfferer) {
                createAndSendOffer(socketId, userId);
            }
        });

        socket.on(SocketEvents.EXISTING_VOICE_USER_JOINED, (data) => {
            const { socketId, userId, isOfferer: shouldBeOfferer } = data;
            isOfferer.current = shouldBeOfferer;
            if (shouldBeOfferer && socketId !== socket.id && !peers.current[socketId]) {
                createAndSendOffer(socketId, userId);
            }
        });

        socket.on(SocketEvents.RECEIVE_ICE_CANDIDATE, handleReceiveIceCandidate);
        socket.on(SocketEvents.RECEIVE_OFFER, handleReceiveOffer);
        socket.on(SocketEvents.RECEIVE_ANSWER, handleReceiveAnswer);
        socket.on(SocketEvents.VOICE_USER_LEFT, (data) => {
            const { socketId } = data;
            if (peers.current[socketId]) {
                peers.current[socketId].peerConnection.close();
                delete peers.current[socketId];
            }
            const audioElement = document.getElementById(`audio-${socketId}`);
            if (audioElement) {
                audioElement.remove();
            }
        });

        return () => {
            socket.off(SocketEvents.NEW_VOICE_USER_JOINED);
            socket.off(SocketEvents.EXISTING_VOICE_USER_JOINED);
            socket.off(SocketEvents.RECEIVE_ICE_CANDIDATE);
            socket.off(SocketEvents.RECEIVE_OFFER);
            socket.off(SocketEvents.RECEIVE_ANSWER);
            socket.off(SocketEvents.VOICE_USER_LEFT);

            // Cleanup
            Object.values(peers.current).forEach(peer => {
                peer.peerConnection.close();
            });
            peers.current = {};
        };
    }, [isVoiceChatEnabled, enableVoiceChat, socket, createAndSendOffer,
        handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);

    const toggleMute = useCallback(() => {
        if (localAudioStream.current) {
            localAudioStream.current.getAudioTracks().forEach(track => {
                track.enabled = isMuted;
            });
        }
        setIsMuted(prev => !prev);
    }, [isMuted]);

    return (
        <div>
            <button
                onClick={toggleMute}
                className={`${styles.micButton} ${isMuted ? styles.muted : styles.unmuted}`}
            >
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
        </div>
    );
}

export default VoiceChat;