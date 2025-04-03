import { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [lobby, setLobby] = useState(null);

    return (
        <GlobalContext.Provider value={{
            currentUser,
            setCurrentUser,
            lobby,
            setLobby
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
