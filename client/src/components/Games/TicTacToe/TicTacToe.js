import { useState, useEffect } from "react";
import { useGlobal } from "../../../context/GlobalContext";
import { useSocket } from "../../../context/SocketContext";
import { SocketEvents } from "../../../enums/socketevents.enums";
import style from './TicTacToe.module.css';
import { defaultTicTacToeState } from "../../../utils/DefaultState";

const TicTacToe = () => {
    const { socket, connected } = useSocket();
    const { lobby, currentUser } = useGlobal();
    const [gameState, setGameState] = useState(defaultTicTacToeState);

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
                    setGameState(gameState);
                }
            });

        return () => {
            if (socket) {
                socket.off(SocketEvents.START_GAME_1);
            }
        };
    }, [setGameState, socket, connected, gameState]);

    const renderCups = (color, cups) => {
        const cupImage = color === 'blue' ? '/Blue_cup.png' : '/Pink_cup.png';
        console.log(`Rendering ${color} cups:`, cups); // Debug log
        return cups?.map((exists, index) => (
            <div
                key={`${color}-cup-${index}`}
                className={`${style.cup} ${style[color]} ${!exists ? style.empty : ''}`}
                style={{
                    transform: `scale(${0.7 + (index * 0.15)})`,
                    opacity: exists ? 1 : 0.3,
                    backgroundImage: `url(${cupImage})`
                }}
            />
        ));
    };

    const renderBoard = () => {
        return (
            <div className={style.boardContainer}>
                {
                    gameState?.board.map(row => (
                        <div className={style.row}>
                            {
                                row.map(cell => (
                                    <div className={`${style.cell} ${cell.color ? style[cell.color] : ''}`}>
                                        {cell.color !== "" && (
                                            <div
                                                className={style.cup}
                                                style={{
                                                    transform: `scale(${0.7 + (cell.weight * 0.15)})`,
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
            <div className={style.topContainer}>
                <div className={style.topLeft}>
                    {renderCups('blue', gameState?.bluePlayer?.cups)}
                </div>
                <div className={style.topMiddle}>
                    {renderBoard()}
                </div>
                <div className={style.topRight}>
                    {renderCups('pink', gameState?.pinkPlayer?.cups)}
                </div>
            </div>
            <div className={style.bottomContainer}>
                <div className={style.bottomLeft}></div>
                <div className={style.bottomRight}></div>
            </div>
        </div>
    );
};

export default TicTacToe;
