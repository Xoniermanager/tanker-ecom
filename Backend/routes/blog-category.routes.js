const express = require("express");
const router = express.Router();
const { BlogCategoryController } = require("../controllers/blog-category.controller");
const authorize = require("../middlewares/auth");
const { validateBlogCategory } = require("../middlewares/validation");

const blogCategoryController = new BlogCategoryController();

// ==================== Blog Category Routes ====================
router.get("/", blogCategoryController.getAllCategories);
router.get("/:slug", blogCategoryController.getCategoryBySlug);
router.post("/", authorize(['admin']), validateBlogCategory, blogCategoryController.createCategory);
router.put("/:id", authorize(['admin']), validateBlogCategory, blogCategoryController.updateCategory);
router.delete("/:id", authorize(['admin']), blogCategoryController.deleteCategory);

module.exports = router;