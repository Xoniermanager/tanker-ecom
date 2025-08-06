const express = require("express");
const upload = require("../config/multer");
const { BlogController } = require("../controllers/blog.controller");
const authorize = require("../middlewares/auth");
const {
    validateUpsertBlog,
    validatePublishStatus,
    validateBlogFilterQuery
} = require("../middlewares/validation");

const router = express.Router();
const blogController = new BlogController();

// ==================== Blog Routes ====================
router.get("/", authorize(['admin']), validateBlogFilterQuery, blogController.getAllBlogs);
router.get("/published", validateBlogFilterQuery, blogController.getPublishedBlogs);
router.get("/:slug", blogController.getPublishedBlogBySlug);
router.get("/author/:userId", blogController.getBlogsByAuthor);
router.post(
    "/",
    authorize(['admin']),
    upload.single("thumbnail"),
    validateUpsertBlog,
    blogController.createBlog
);
router.put(
    "/:id",
    authorize(['admin']),
    upload.single("thumbnail"),
    validateUpsertBlog,
    blogController.updateBlog
);
router.patch(
    "/:slugOrId/publish",
    validatePublishStatus,
    authorize(['admin']),
    blogController.setPublishStatus
);
router.delete(
    "/:id",
    authorize(['admin']),
    blogController.deleteBlog
)

module.exports = router;
