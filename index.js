const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const etNewsRoutes = require('./routes/etNewRoutes');
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(etNewsRoutes);

app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'UP',
        database: 'Connected',
        uptime: process.uptime(),
        timestamp: new Date()
    };
    res.status(200).json(healthStatus);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

