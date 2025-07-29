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
const swaggerDocsRoute = require("./routes/docs.routes");
const SiteSettingRoutes = require("./routes/siteSetting.routes");
const CmsRoutes = require("./routes/cms.routes");
const BlogRoutes = require("./routes/blog.routes");
const GalleryRoutes = require("./routes/gallery.routes");
const ContactRoutes = require("./routes/contact.routes");
const upload = require("./config/multer");
const { uploadImage, getPublicFileUrl } = require("./utils/storage");
const customResponse = require("./utils/response");
const authorize = require('./middlewares/auth');

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
        app.use("/api/cms", CmsRoutes);
        app.use("/api/blogs", BlogRoutes);
        app.use("/api/gallery", GalleryRoutes);
        app.use("/api/contact", ContactRoutes);

        // Route to upload files
        app.put("/api/upload-files", authorize(['admin']), upload.single("file"), async (req, res) => {
            if (!req.file) {
                return res.status(400).json({ message: "file is required." });
            }

            const file = await uploadImage(req.file.buffer, req.file.originalname, "uploads", req.file.mimetype);
            const fullFilePath = getPublicFileUrl(file.key);
            customResponse(res, "File uploaded successfully", {
                file,
                fullPath: fullFilePath
            });
        });

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
