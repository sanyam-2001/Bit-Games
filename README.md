# BitGames - Multiplayer Gaming Platform

BitGames is a multiplayer gaming platform with a TRON-inspired UI that allows users to create and join game lobbies to play various games with friends.

## Features

- **Tron-Like UI**: Modern neon-inspired interface with blue and pink highlights and grid backgrounds
- **Lobby System**: Create lobbies or join existing ones using 6-character codes
- **Real-Time Chat**: Built-in chat functionality for players in the same lobby
- **Socket.io Integration**: Real-time communication using Socket.io

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/bit-games.git
cd bit-games
```

2. Install dependencies for both server and client
```
npm run install-app
```

3. Start the development server
```
npm run dev
```

This will start both the backend server and the React client application.

- Backend server runs on port 5000
- Frontend React app runs on port 3000

## Project Structure

```
bit-games/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # UI components
│       ├── context/      # React context providers
│       ├── pages/        # Page components
│       └── styles/       # Styled-components theme and global styles
├── server/               # Backend Express.js server
│   ├── config/           # Server configuration
│   ├── routes/           # API routes
│   └── socket/           # Socket.io event handlers
└── package.json          # Root package.json for scripts
```

## Technologies Used

- **Frontend**:
  - React
  - React Router
  - Styled Components
  - Framer Motion
  - Socket.io Client

- **Backend**:
  - Node.js
  - Express
  - Socket.io

## Future Features

- Multiple game modes (Tic-tac-toe, Rock Paper Scissors, etc.)
- User accounts and persistent profiles
- Game history and statistics
- Spectator mode

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the TRON movie visual aesthetic
- Built for multiplayer gaming enthusiasts

---

Made with ❤️ for BitGames 