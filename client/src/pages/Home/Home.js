import React, { useEffect, useState } from 'react';
import { Card, FlexContainer } from '../../components/ui/Container/Container';
import Input, { InputGroup } from '../../components/ui/Input/Input';
import styles from './Home.module.css';
import PrimaryButton from '../../components/ui/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton/SecondaryButton';
import { useSocket } from '../../context/SocketContext';

const Home = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [loginData, setLoginData] = useState({ name: '', lobbyId: '' });
    const [createLobbyData, setCreateLobbyData] = useState({ name: '' });
    const [isAnimating, setIsAnimating] = useState(false);
    const { socket, connected } = useSocket();
    // Handle card flip with animation lock
    const handleFlip = (flipState) => {
        if (!isAnimating) {
            setIsAnimating(true);
            setIsFlipped(flipState);
            setTimeout(() => {
                setIsAnimating(false);
            }, 800); // Match this with the CSS transition duration
        }
    };

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateLobbyChange = (e) => {
        setCreateLobbyData({
            ...createLobbyData,
            [e.target.name]: e.target.value
        });
    };

    const handleJoinLobby = async (e) => {
        e.preventDefault();
        console.log('Join Lobby:', loginData);
        if (connected) {
            socket.emit('joinLobby', loginData);
        }
    };

    const handleCreateLobby = async (e) => {
        e.preventDefault();
        console.log('Create Lobby:', createLobbyData);
        if (connected) {
            socket.emit('createLobby', createLobbyData);
        }
    };
    useEffect(() => {
        if (connected) {
            socket.on('enterLobby', () => {
                console.log('Entering lobby');
            });
        }

        return () => {
            if (socket) {
                socket.off('enterLobby');
            }
        }
    }, [socket, connected])
    return (
        <FlexContainer
            direction="column"
            align="center"
            justify="center"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className={styles.flippableCard}>
                <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : styles.notFlipped}`}>
                    <div className={`${styles.cardSide} ${styles.cardFront}`}>
                        <Card className={styles.styledCard}>
                            <div className={styles.gridBackground}></div>
                            <div className={styles.scanLines}></div>
                            <div></div> {/* This is for the pixelated border effect */}
                            <h2 className={styles.cardTitle}>Join a Lobby</h2>
                            <form onSubmit={handleJoinLobby}>
                                <InputGroup label="Name">
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={loginData.name}
                                        onChange={handleLoginChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <InputGroup label="Lobby ID">
                                    <Input
                                        type="text"
                                        name="lobbyId"
                                        placeholder="Enter lobby ID"
                                        value={loginData.lobbyId}
                                        onChange={handleLoginChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <FlexContainer direction="column" className={styles.buttonsContainer} align="center">
                                    <PrimaryButton type="submit" variant="primary">Join Lobby</PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleFlip(true)}
                                        disabled={isAnimating}
                                    >
                                        Create New Lobby
                                    </SecondaryButton>
                                </FlexContainer>
                            </form>
                        </Card>
                    </div>
                    <div className={`${styles.cardSide} ${styles.cardBack}`}>
                        <Card className={styles.styledCard}>
                            <div className={styles.gridBackground}></div>
                            <div className={styles.scanLines}></div>
                            <div></div> {/* This is for the pixelated border effect */}
                            <h2 className={styles.cardTitle}>Create a Lobby</h2>
                            <form onSubmit={handleCreateLobby}>
                                <InputGroup label="Name">
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={createLobbyData.name}
                                        onChange={handleCreateLobbyChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <FlexContainer direction="column" className={styles.buttonsContainer} align="center">
                                    <PrimaryButton type="submit" variant="primary">Create Lobby</PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleFlip(false)}
                                        disabled={isAnimating}
                                    >
                                        Join Existing Lobby
                                    </SecondaryButton>
                                </FlexContainer>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </FlexContainer>
    );
};

export default Home; 