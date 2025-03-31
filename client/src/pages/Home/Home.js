import React, { useState } from 'react';
import { Card, FlexContainer } from '../../components/ui/Container/Container';
import Input, { InputGroup } from '../../components/ui/Input/Input';
import styles from './Home.module.css';
import PrimaryButton from '../../components/ui/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton/SecondaryButton';
const Home = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [loginData, setLoginData] = useState({ name: '', roomId: '' });
    const [createRoomData, setCreateRoomData] = useState({ name: '', roomName: '' });
    const [isAnimating, setIsAnimating] = useState(false);

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

    const handleCreateRoomChange = (e) => {
        setCreateRoomData({
            ...createRoomData,
            [e.target.name]: e.target.value
        });
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        console.log('Join Room:', loginData);
        // Add join room logic here
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();
        console.log('Create Room:', createRoomData);
        // Add create room logic here
    };

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
                            <h2 className={styles.cardTitle}>Join a Room</h2>
                            <form onSubmit={handleJoinRoom}>
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
                                <InputGroup label="Room ID">
                                    <Input
                                        type="text"
                                        name="roomId"
                                        placeholder="Enter room ID"
                                        value={loginData.roomId}
                                        onChange={handleLoginChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <FlexContainer direction="column" className={styles.buttonsContainer} align="center">
                                    <PrimaryButton type="submit" variant="primary">Join Room</PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleFlip(true)}
                                        disabled={isAnimating}
                                    >
                                        Create New Room
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
                            <h2 className={styles.cardTitle}>Create a Room</h2>
                            <form onSubmit={handleCreateRoom}>
                                <InputGroup label="Name">
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={createRoomData.name}
                                        onChange={handleCreateRoomChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <InputGroup label="Room Name">
                                    <Input
                                        type="text"
                                        name="roomName"
                                        placeholder="Enter room name"
                                        value={createRoomData.roomName}
                                        onChange={handleCreateRoomChange}
                                        variant="primary"
                                        required
                                    />
                                </InputGroup>
                                <FlexContainer direction="column" className={styles.buttonsContainer} align="center">
                                    <PrimaryButton type="submit" variant="primary">Create Room</PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleFlip(false)}
                                        disabled={isAnimating}
                                    >
                                        Join Existing Room
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