import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";

// Create context
const SocketContext = createContext(null);

// Socket.io connection URL - in development it connects to the backend server
const SOCKET_URL = "http://localhost:5001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    console.log("SOCKET_URL", SOCKET_URL);
    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    setSocket(newSocket);

    // Clean up socket connection on unmount
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
