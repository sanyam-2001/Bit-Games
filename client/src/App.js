import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home/Home';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { Toast } from './components/ui/index';
function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Toast />
            <Router>
                <SocketProvider>
                    <Routes>
                        <Route path='/' element={
                            <div className="App">
                                <LandingPage />
                            </div>
                        } />
                        <Route path="/home" element={
                            <Home />
                        } />
                    </Routes>
                </SocketProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
