const blogCategoryService = require("../services/blog-category.service");
const customResponse = require("../utils/response");

class BlogCategoryController {
    /**
     * Get all blog categories.
     */
    getAllCategories = async (req, res, next) => {
        try {
            const categories = await blogCategoryService.getAllCategories();
            customResponse(res, "Blog categories fetched successfully", categories);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get category details by slug.
     */
    getCategoryBySlug = async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const category = await blogCategoryService.getCategoryBySlug(slug);
            customResponse(res, "Blog category details fetched successfully", category);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a new blog category.
     */
    createCategory = async (req, res, next) => {
        try {
            const data = req.body;
            const category = await blogCategoryService.createCategory(data);
            customResponse(res, "Blog category created successfully", category);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update a blog category.
     */
    updateCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await blogCategoryService.updateCategory(id, data);
            customResponse(res, "Blog category updated successfully", updated);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a blog category.
     */
    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            await blogCategoryService.deleteCategory(id);
            customResponse(res, "Blog category deleted successfully", null);
        } catch (error) {
            next(error);
        }
    };
}

exports.BlogCategoryController = BlogCategoryController;
