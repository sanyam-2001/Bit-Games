import express from "express";
import http from "http";
import GlobalRoutes from "./routes/GlobalRoutes.js";
import path from "path";
import { setupSocketHandlers } from "./config/Socket.config.js";
import { setupRedis } from "./config/Redis.config.js";
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from .env

const app = express(); // Initialize express app
const server = http.createServer(app);

// CORS middleware to allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

setupSocketHandlers(server);
setupRedis()
    .then((x) => console.log(x))
    .catch((error) => console.error("Redis setup failed:", error));

// Define PORT
const PORT = process.env.PORT || 5001;

// Routes
app.use("/", GlobalRoutes);

if (process.env.ENVIRONMENT === "PROD") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
