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
const SiteSettingRoutes = require("./routes/site-setting.routes");
const CmsRoutes = require("./routes/cms.routes");
const BlogRoutes = require("./routes/blog.routes");
const BlogCategoryRoutes = require("./routes/blog-category.routes");
const GalleryRoutes = require("./routes/gallery.routes");
const ContactRoutes = require("./routes/contact.routes");
const TestimonialRoutes = require("./routes/testimonial.routes");
const ProductCategoriesRoutes = require("./routes/product-category.routes");
const ProductsRoutes = require("./routes/product.routes");
const CartRoutes = require("./routes/cart.routes");
const OrderRoutes = require("./routes/order.routes");
const DashboardRoutes = require("./routes/dashboard.route");
const WebhookRoutes = require("./routes/webhook.routes");
const ShippingRoutes = require("./routes/shipping-rate.routes");
const upload = require("./config/multer");
const { uploadImage, getPublicFileUrl } = require("./utils/storage");
const customResponse = require("./utils/response");
const authorize = require("./middlewares/auth");
const queueManager = require("./queues/manager");

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoDB.connect();

    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set("trust proxy", 1);

    app.use("/webhook", WebhookRoutes);

    // Middleware
    app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    app.use(
      cors({
        origin: [process.env.CLIENT_URL, "http://54.206.246.145:3001"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    );
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use("/public", express.static(path.join(__dirname, "public")));

    // Routes
    app.use("/docs", swaggerDocsRoute);
    app.use("/api/auth", AuthRoutes);
    app.use("/api/site-settings", SiteSettingRoutes);
    app.use("/api/cms", CmsRoutes);
    app.use("/api/blogs", BlogRoutes);
    app.use("/api/blog-categories", BlogCategoryRoutes);
    app.use("/api/gallery", GalleryRoutes);
    app.use("/api/testimonials", TestimonialRoutes);
    app.use("/api/contact", ContactRoutes);
    app.use("/api/product-categories", ProductCategoriesRoutes);
    app.use("/api/products", ProductsRoutes);
    app.use("/api/cart", CartRoutes);
    app.use("/api/order", OrderRoutes);
    app.use("/api/dashboard", DashboardRoutes);
    app.use("/api/shipping-charges", ShippingRoutes);

    // Route to upload files
    app.put(
      "/api/upload-files",
      authorize(["admin", "user"]),
      upload.single("file"),
      async (req, res) => {
        if (!req.file) {
          return res.status(400).json({ message: "file is required." });
        }

        const file = await uploadImage(
          req.file.buffer,
          req.file.originalname,
          "uploads",
          req.file.mimetype
        );

        const fullFilePath = getPublicFileUrl(file.url);
        customResponse(res, "File uploaded successfully", {
          file,
          fullPath: fullFilePath,
        });
      }
    );

    // Global middleware for standardized errors
    app.use(errorHandler);

    // Global middleware for standardized responses
    app.use(responseHandler);

    // Initialize queue manager to process background jobs
    // await queueManager.initialize();

    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });

    module.exports = app;
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
