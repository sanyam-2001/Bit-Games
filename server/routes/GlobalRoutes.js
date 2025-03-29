import express from 'express';
const router = express.Router();

// Routes
router.get('/api', (req, res) => {
    res.send('BitGames API is running');
});

export default router;
