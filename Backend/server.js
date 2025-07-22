const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const mongoDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const responseHandler = require("./middlewares/responseHandler");
const AuthRoutes = require("./routes/auth.routes");
const SiteSettingRoutes = require("./routes/siteSetting.routes");
const swaggerDocsRoute = require("./routes/docs.routes");

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoDB.connect();

        // TODO: Reload persisted jobs on server startup

        const app = express();
        const PORT = process.env.PORT || 3000;

        // Middleware
        app.use(helmet());
        app.use(
            cors({
                origin: 'http://localhost:3001',
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: ["Content-Type", "Authorization"],
                credentials: true
            })
        );
        app.use(morgan("dev"));
        app.use(express.json());
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: true }));
        app.use('/public', express.static(path.join(__dirname, 'public')));

        // Routes
        app.use("/docs", swaggerDocsRoute);
        app.use("/api/auth", AuthRoutes);
        app.use("/api/site-settings", SiteSettingRoutes);

        // Global middleware for standardized errors
        app.use(errorHandler);

        // Global middleware for standardized responses
        app.use(responseHandler);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        module.exports = app;
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

startServer();
