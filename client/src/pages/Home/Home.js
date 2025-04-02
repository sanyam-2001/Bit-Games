import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Card, FlexContainer } from "../../components/ui/Container/Container";
import Input, { InputGroup } from "../../components/ui/Input/Input";
import styles from "./Home.module.css";
import PrimaryButton from "../../components/ui/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton/SecondaryButton";
import { useSocket } from "../../context/SocketContext";
import { showToast } from "../../utils/toast";
import { SocketEvents as events } from "../../enums/socketevents.enums";

const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", lobbyId: "" });
  const [createLobbyData, setCreateLobbyData] = useState({ name: "" });
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
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateLobbyChange = (e) => {
    setCreateLobbyData({
      ...createLobbyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleJoinLobby = async (e) => {
    e.preventDefault();
    if (connected) {
      socket.emit(events.JOIN_LOBBY, loginData);
    }
  };

  const handleCreateLobby = async (e) => {
    e.preventDefault();
    if (connected) {
      socket.emit(events.CREATE_LOBBY, createLobbyData);
    }
  };
  useEffect(() => {
    if (connected) {
      socket.on(events.ENTER_LOBBY, ({ success, error, data }) => {
        if (success) {
          console.log(
            `Welcome to lobby ${data.lobby.lobbyId}, ${data.lobby.players[0].name}`
          );
        } else {
          showToast(error, "error");
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(events.ENTER_LOBBY);
      }
    };
  }, [socket, connected]);
  return (
    <FlexContainer
      direction="row"
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div className={styles.flippableCard}>
        <div
          className={`${styles.cardInner} ${
            isFlipped ? styles.flipped : styles.notFlipped
          }`}
        >
          <div
            className={`${styles.cardSide} ${styles.cardFront} ${styles.frostedBlue}`}
          >
            <Card className={styles.styledCard}>
              <div className={styles.gridBackground}></div>
              <div className={styles.scanLines}></div>
              <div className={styles.frostedBlueOverlay}></div>
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
                <FlexContainer
                  direction="column"
                  className={styles.buttonsContainer}
                  align="center"
                >
                  <PrimaryButton type="submit" variant="primary">
                    Join Lobby
                  </PrimaryButton>
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
          <div
            className={`${styles.cardSide} ${styles.cardBack} ${styles.frostedBlue}`}
          >
            <Card className={styles.styledCard}>
              <div className={styles.gridBackground}></div>
              <div className={styles.scanLines}></div>
              <div className={styles.frostedBlueOverlay}></div>
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
                <FlexContainer
                  direction="column"
                  className={styles.buttonsContainer}
                  align="center"
                >
                  <PrimaryButton type="submit" variant="primary">
                    Create Lobby
                  </PrimaryButton>
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
      <div className={styles.splineContainer}>
        <Spline scene="https://prod.spline.design/Srlm6Ga2ks2466Ta/scene.splinecode" />
      </div>
    </FlexContainer>
  );
};

export default Home;
