const blogService = require("../services/blog.service");
const customResponse = require("../utils/response");
const { uploadImage } = require("../utils/storage");

class BlogController {
    /**
     * Get all blogs (admin view).
     */
    getAllBlogs = async (req, res, next) => {
        try {
            const blogs = await blogService.getAllBlogs();
            customResponse(res, "All blogs fetched successfully", blogs);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get published blogs (public view).
     */
    getPublishedBlogs = async (req, res, next) => {
        try {
            const blogs = await blogService.getPublishedBlogs();
            customResponse(res, "Published blogs fetched successfully", blogs);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get a published blog by slug (public view).
     */
    getPublishedBlogBySlug = async (req, res, next) => {
        try {
            const { slug } = req.params;
            const blog = await blogService.getPublishedBlogBySlug(slug);
            customResponse(res, "Blog fetched successfully", blog);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get blogs by author.
     */
    getBlogsByAuthor = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const blogs = await blogService.getBlogsByAuthor(userId);
            customResponse(res, "Blogs by author fetched successfully", blogs);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a blog.
     */
    createBlog = async (req, res, next) => {
        try {
            const data = req.body;

            if (req.file) {
                const thumbnailUrl = await uploadImage(req.file, "blog-thumbnails");
                data.thumbnail = thumbnailUrl;
            }

            const blog = await blogService.createBlog({
                ...data,
                author: {
                    userId: req.user._id,
                    name: req.user.fullName,
                }
            });

            customResponse(res, "Blog saved successfully", blog);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a blog.
     */
    updateBlog = async (req, res, next) => {
        try {
            const data = req.body;

            if (req.file) {
                const thumbnailUrl = await uploadImage(req.file, "blog-thumbnails");
                data.thumbnail = thumbnailUrl;
            }

            const blog = await blogService.updateBlog(req.params.id, {
                ...data,
                author: {
                    userId: req.user._id,
                    name: req.user.fullName,
                }
            });

            customResponse(res, "Blog saved successfully", blog);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Publish or unpublish a blog.
     */
    setPublishStatus = async (req, res, next) => {
        try {
            const { slugOrId } = req.params;
            const { publish } = req.body;

            const updatedBlog = await blogService.setPublishStatus(slugOrId, publish);
            const statusMsg = publish ? "published" : "unpublished";
            customResponse(res, `Blog ${statusMsg} successfully`, updatedBlog);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a blog.
     */
    deleteBlog = async (req, res, next) => {
        try {
            const { id } = req.params;
            await blogService.deleteBlog(id);
            customResponse(res, "Blog deleted successfully", null);
        } catch (error) {
            next(error);
        }
    }
}

exports.BlogController = BlogController;
