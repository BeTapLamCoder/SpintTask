const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const etNewsRoutes = require('./routes/etNewRoutes');
const axios = require("axios");
const db = require("./database");

dotenv.config();

const app = express();
const startTime = Date.now();

app.use(cors({ origin: 'dev-economic-technology-club.vercel.app' }));
app.use(cookieParser());
app.use(express.json());
app.use(etNewsRoutes);

app.get('/api/health', async (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    const [dbResult, apiResult] = await Promise.allSettled([
        checkDatabase(),
        checkExternalAPI()
    ]);

    const databaseStatus = dbResult.status === "fulfilled" ? dbResult.value : "disconnected";
    const externalApiStatus = apiResult.status === "fulfilled" ? apiResult.value : "disconnected";

    const isHealthy = databaseStatus === "connected" && externalApiStatus === "connected";

    const healthStatus = {
        status: isHealthy ? "healthy" : "unhealthy",
        uptime,
        dependencies: [
            { name: "database", status: databaseStatus },
            { name: "externalAPI", status: externalApiStatus }
        ]
    };

    res.status(isHealthy ? 200 : 500).json(healthStatus);
});

async function checkDatabase() {
    try {
        await db.raw('SELECT 1+1 AS result');
        return "connected";
    } catch (err) {
        console.error("Database connection error:", err.message);
        return "disconnected";
    }
}

async function checkExternalAPI() {
    try {
        await axios.get("https://jsonplaceholder.typicode.com/posts");
        return "connected";
    } catch (err) {
        console.error("External API error:", err.message);
        return "disconnected";
    }
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
