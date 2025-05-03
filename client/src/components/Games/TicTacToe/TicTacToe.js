import { useState, useEffect } from "react";
import { useGlobal } from "../../../context/GlobalContext";
import { useSocket } from "../../../context/SocketContext";
import { SocketEvents } from "../../../enums/socketevents.enums";
import style from './TicTacToe.module.css';
import { defaultTicTacToeState } from "../../../utils/DefaultState";
import { showToast } from "../../../utils/toast";
import VoiceChat from '../../../components/VoiceChat/VoiceChat';
import GameEndBanner from "../../ui/GameEndBanner/GameEndBanner";
import { WinStatus } from "../../../enums/WinStatus.enum";

const TicTacToe = () => {
    const { socket, connected } = useSocket();
    const { lobby, currentUser } = useGlobal();
    const [gameState, setGameState] = useState(defaultTicTacToeState);
    const [draggedCup, setDraggedCup] = useState(null);
    const [dragOverCell, setDragOverCell] = useState(null);
    const [myColor, setMyColor] = useState("");
    const [showEndBanner, setShowEndBanner] = useState(false);
    const [gameWinStatus, setGameWinStatus] = useState(false);

    const bluePlayerName = lobby?.players?.find((el) => el.id === gameState?.bluePlayer?.playerId)?.name;
    const pinkPlayerName = lobby?.players?.find((el) => el.id === gameState?.pinkPlayer?.playerId)?.name;

    useEffect(() => {
        if (socket && connected && lobby.admin === currentUser.id) {
            socket.emit(SocketEvents.CREATE_GAME_1, { lobbyId: lobby.id });
        }
    }, [lobby, currentUser, socket, connected]);

    useEffect(() => {
        if (socket && connected)
            socket.on(SocketEvents.START_GAME_1, ({ success, error, data }) => {
                if (data?.gameState) {
                    console.log(data?.gameState)
                    setGameState(data.gameState);
                    if (data.gameState.bluePlayer.playerId === currentUser.id) {
                        setMyColor("blue");
                    } else {
                        setMyColor("pink");
                    }
                }
            });

        socket.on(SocketEvents.TTT_GAME_UPDATE_1, ({ success, error, data }) => {
            if (data?.gameState) {
                setGameState(data?.gameState);
            }
            setDraggedCup(null);
            setDragOverCell(null);
        });

        socket.on(SocketEvents.TTT_GAME_OVER_1, ({ success, error, data }) => {
            const { winnerId, game } = data;
            if (game?.gameState) {
                setGameState(game?.gameState);
            }
            setShowEndBanner(true);

            if (!winnerId) {
                setGameWinStatus(WinStatus.DRAW);
            } else if (winnerId === currentUser.id) {
                setGameWinStatus(WinStatus.WIN);
            } else {
                setGameWinStatus(WinStatus.LOSE);
            }
        });

        return () => {
            if (socket) {
                socket.off(SocketEvents.START_GAME_1);
                socket.off(SocketEvents.TTT_GAME_UPDATE_1);
                socket.off(SocketEvents.TTT_GAME_OVER_1);
            }
        };
    }, [setGameState, socket, connected, currentUser.id]);

    const handleDragStart = (e, color, index) => {
        console.log(currentUser)
        const isMyTurn = gameState.turnId === currentUser.id;

        if (!isMyTurn) {
            showToast.error("Not Your Turn");
            return;
        };
        if (color !== myColor) {
            showToast.error("Not Your Cup");
            return;
        }
        setDraggedCup({ color, index });
        e.dataTransfer.setData('text/plain', JSON.stringify({ color, index }));
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add(style.dragging);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove(style.dragging);
        setDraggedCup(null);
        setDragOverCell(null);
    };

    const handleDragOver = (e, rowIndex, colIndex) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverCell({ row: rowIndex, col: colIndex });
    };

    const handleDragLeave = (e) => {
        setDragOverCell(null);
    };
    const isLegalMove = (row, col) => {
        console.log(row, col, draggedCup);
        if (gameState?.board[row][col].color === draggedCup.color) return false;
        if (gameState?.board[row][col].weight >= (draggedCup.index + 1)) return false;
        return true;
    }
    const handleDrop = (e, rowIndex, colIndex) => {
        e.preventDefault();
        if (!draggedCup) return;

        //Check if Legal Move
        if (!isLegalMove(rowIndex, colIndex)) {
            showToast.error("Invalid Move");
            return;
        }
        socket.emit(SocketEvents.TTT_MOVE_1, {
            rowIndex,
            colIndex,
            draggedCup,
            lobbyId: lobby?.id
        });
    };

    const renderCups = (color, cups) => {
        const cupImage = color === 'blue' ? '/Blue_cup.png' : '/Pink_cup.png';
        return cups?.map((exists, index) => (
            <div
                key={`${color}-cup-${index}`}
                className={`${style.cup} ${style[color]} ${!exists ? style.empty : ''}`}
                style={{
                    transform: `scale(${0.7 + (index * 0.15)})`,
                    opacity: exists ? 1 : 0.3,
                    backgroundImage: `url(${cupImage})`,
                    cursor: exists ? 'grab' : 'not-allowed'
                }}
                draggable={exists}
                onDragStart={(e) => handleDragStart(e, color, index)}
                onDragEnd={handleDragEnd}
            />
        ));
    };

    const renderBoard = () => {
        return (
            <div className={style.boardContainer}>
                {
                    gameState?.board.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className={style.row}>
                            {
                                row.map((cell, colIndex) => (
                                    <div
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        className={`${style.cell} ${cell.color ? style[cell.color] : ''} ${dragOverCell?.row === rowIndex && dragOverCell?.col === colIndex ? style.dragOver : ''
                                            }`}
                                        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                                    >
                                        {cell.color !== "" && (
                                            <div
                                                className={style.cup}
                                                style={{
                                                    transform: `scale(${0.7 + (cell.weight - 1) * 0.15})`,
                                                    backgroundImage: `url(${cell.color === 'blue' ? '/Blue_cup.png' : '/Pink_cup.png'})`
                                                }}
                                            />
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        );
    }

    return (
        <div className={style.container}>
            <GameEndBanner 
                visible={showEndBanner} 
                state={gameWinStatus} 
                onClose={() => setShowEndBanner(false)} 
                />
            <div className={style.topContainer}>
                <div className={`${style.topLeft} ${gameState.turnId === currentUser.id && myColor === "blue" ? style.activePanel : ""}`}>
                    {renderCups('blue', gameState?.bluePlayer?.cups)}
                </div>
                <div className={style.topMiddle}>
                    {renderBoard()}
                </div>
                <div className={`${style.topRight} ${gameState.turnId === currentUser.id && myColor === "pink" ? style.activePanel : ""}`}>
                    {renderCups('pink', gameState?.pinkPlayer?.cups)}
                </div>
            </div>
            <div className={style.bottomContainer}>
                <div className={style.bottomLeft}>
                    <VoiceChat />
                </div>
                <div className={style.bottomRight}>
                    <div className={style.pixelatedScore}>
                        {pinkPlayerName} {gameState?.score?.pink}-{gameState?.score?.blue} {bluePlayerName}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
