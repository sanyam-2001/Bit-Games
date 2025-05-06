import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './LandIO.module.css';
import { useGlobal } from '../../../context/GlobalContext';
import { useSocket } from '../../../context/SocketContext';
import { SocketEvents } from '../../../enums/socketevents.enums';
import { defaultLandIOState } from '../../../utils/DefaultState';

const LandIO = () => {
    const { lobby, currentUser, setLobby } = useGlobal();
    const { socket, connected } = useSocket();
    const [gameState, setGameState] = useState(defaultLandIOState);
    const canvasRef = useRef(null);

    const handlePlayerMove = useCallback((action) => {
        if (socket && lobby?.activeGameInstanceId) {
            socket.emit(SocketEvents.PLAYER_MOVE_4, {
                action,
                lobbyId: lobby?.id,
                playerId: currentUser?.id,
                gameId: lobby.activeGameInstanceId
            });
        }
    }, [socket, lobby, currentUser]);

    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowUp':
                handlePlayerMove("U");
                break;
            case 'ArrowDown':
                handlePlayerMove("D");
                break;
            case 'ArrowLeft':
                handlePlayerMove("L");
                break;
            case 'ArrowRight':
                handlePlayerMove("R");
                break;
            case ' ':
                handlePlayerMove("S");
                break;
            default:
                break;
        }
    }, [handlePlayerMove]);

    useEffect(() => {
        if (socket && connected && lobby.admin === currentUser.id) {
            socket.emit(SocketEvents.CREATE_GAME_4, {
                lobbyId: lobby?.id
            });
        }
    }, [socket, connected, lobby, currentUser]);

    useEffect(() => {
        if (socket && connected) {
            socket.on(SocketEvents.START_GAME_4, ({ success, err, data }) => {
                setGameState(data?.gameState);
                setLobby((prev) => {
                    const newLobby = prev;
                    newLobby.activeGameInstanceId = data?.id;
                    return newLobby;
                });
            });

            socket.on(SocketEvents.GAME_STATE_UPDATE_4, ({ success, err, data }) => {
                setGameState(data?.gameState);
            });
        }

        return () => {
            socket.off(SocketEvents.START_GAME_4);
            socket.off(SocketEvents.GAME_STATE_UPDATE_4);
        }
    }, [socket, connected, setLobby]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const cellSize = 40; // Size of each cell in pixels
        const boardSize = gameState.boardSize;
        const viewSize = 20; // Size of the visible grid around player

        // Set canvas size to be a perfect square based on cell size and view size
        const canvasSize = cellSize * viewSize;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Find current player
        const currentPlayer = gameState.players.find(player => player.id === currentUser.id);
        if (!currentPlayer) return;

        // Calculate the visible area around the player
        const startX = Math.max(0, currentPlayer.posX - Math.floor(viewSize / 2));
        const startY = Math.max(0, currentPlayer.posY - Math.floor(viewSize / 2));
        const endX = Math.min(boardSize, startX + viewSize);
        const endY = Math.min(boardSize, startY + viewSize);

        // Draw grid
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const cell = gameState.board[y][x];
                const drawX = (x - startX) * cellSize;
                const drawY = (y - startY) * cellSize;

                // Draw cell background
                ctx.globalAlpha = cell.status === 'SEMI' ? 0.5 : 1;
                ctx.fillStyle = cell.color.hex;
                ctx.fillRect(drawX, drawY, cellSize, cellSize);

                // Draw cell border
                ctx.globalAlpha = 1;
                ctx.strokeStyle = '#000';
                ctx.strokeRect(drawX, drawY, cellSize, cellSize);
            }
        }

        // Draw player position indicator
        ctx.fillStyle = '#FF0000';
        ctx.globalAlpha = 0.5;
        const playerDrawX = (currentPlayer.posX - startX) * cellSize;
        const playerDrawY = (currentPlayer.posY - startY) * cellSize;
        ctx.fillRect(playerDrawX, playerDrawY, cellSize, cellSize);
    }, [gameState, currentUser.id]);

    const renderBoard = () => {
        return (
            <div className={styles.canvasContainer}>
                <canvas ref={canvasRef} className={styles.canvas}></canvas>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.game}>
                {renderBoard()}
            </div>
            <div className={styles.stats}></div>
        </div>
    );
}

export default LandIO;