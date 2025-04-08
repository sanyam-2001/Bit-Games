import React, { useEffect } from 'react';
import LandingPage from './pages/LandingPage/LandingPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home/Home';
import Lobby from './pages/Lobby/Lobby';
import Game from './pages/Game/Game';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { Toast } from './components/ui/index';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import { get } from './utils/api';
import { showToast } from './utils/toast';

// Wrapper component to fetch games data
const AppContent = () => {
    const { setGameList } = useGlobal();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await get('/api/games/list');
                if (response.success) {
                    setGameList(response.data);
                } else {
                    showToast.error('Failed to fetch games list');
                }
            } catch (error) {
                console.error('Error fetching games:', error);
                showToast.error('Failed to load games');
            }
        };

        fetchGames();
    }, [setGameList]);

    return (
        <Routes>
            <Route path='/' element={
                <div className="App">
                    <LandingPage />
                </div>
            } />
            <Route path="/home" element={
                <Home />
            } />
            <Route path="/lobby" element={
                <Lobby />
            } />
            <Route path="/game" element={
                <Game />
            } />
        </Routes>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Toast />
            <Router>
                <SocketProvider>
                    <GlobalProvider>
                        <AppContent />
                    </GlobalProvider>
                </SocketProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
