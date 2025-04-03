import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const GameList = require('../static/Games.json');

const router = express.Router();

// Routes
router.get('/api', (req, res) => {
    res.send('BitGames API is running');
});

router.get('/api/games/list', (req, res) => {
    res.json({
        success: true,
        error: null,
        data: GameList
    });
});

export default router;
