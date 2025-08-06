const mongoose = require("mongoose");
const blogRepository = require("../repositories/cms/blog.repository");
const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");
const summaryFields = 'title subtitle slug thumbnail tags createdAt author';

class BlogService {
    /**
     * Fetch all blogs with pagination support (admin view).
     *
     * @param {number} page - Current page number (default is 1).
     * @param {number} limit - Number of blogs per page (default is 10).
     * @param {Object} filters - MongoDB query filters (default is empty object - {}).
     * @returns {Promise<{ data: Array, total: number, page: number, limit: number }>} Paginated list of blogs.
     */
    async getAllBlogs(page = 1, limit = 10, filters) {
        const query = {};

        if (filters.tags) {
            const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
            query.tags = { $in: tags };
        }

        if (filters.categories) {
            const categories = Array.isArray(filters.categories) ? filters.categories : [filters.categories];
            query.categories = { $in: categories };
        }

        if (filters.title) {
            query.title = { $regex: filters.title, $options: 'i' }; // case-insensitive search
        }

        if (filters.isPublished) {
            query.isPublished = filters.isPublished;
        }

        return await blogRepository.paginate(query, page, limit, { createdAt: -1 }, null, summaryFields);
    }

    /**
     * Get a published blog by slug (public view).
     * @param {String} slug 
     * @returns {Promise<Object>}
     */
    async getPublishedBlogBySlug(slug) {
        const blog = await blogRepository.findBySlug(slug);
        if (!blog) {
            throw customError(`Blog not found with slug ${slug}`);
        }
        return blog;
    }

    /**
     * Create a new blog.
     * @param {Object} data - blog data
     * @returns {Promise<Object>}
     */
    async createBlog(data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            data.slug = await generateSlugIfNeeded(data.title, data.slug, blogRepository, session);
            const result = await blogRepository.create(data, session);

            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Update an existing blog by ID.
     * @param {ObjectId} id - MongoDB ObjectId.
     * @param {Object} data - updated blog data
     * @returns {Promise<Object>}
     */
    async updateBlog(id, data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // Optionally re-generate slug if slug or title is updated
            if (!data.slug && data.title) {
                data.slug = await generateSlugIfNeeded(data.title, null, blogRepository, session);
            }

            const result = await blogRepository.update(id, data, session);

            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get all blogs authored by a specific user.
     * @param {String} userId 
     * @returns {Promise<Array>}
     */
    async getBlogsByAuthor(userId) {
        return await blogRepository.findByAuthor(userId, summaryFields);
    }

    /**
     * Fetch all published blogs with pagination support (public view).
     *
     * @param {number} page - Current page number (default is 1).
     * @param {number} limit - Number of blogs per page (default is 10).
     * @param {Object} filters - MongoDB query filters (default is empty object - {}).
     * @returns {Promise<{ data: Array, total: number, page: number, limit: number }>} Paginated list of published blogs.
     */
    async getPublishedBlogs(page = 1, limit = 10, filters = {}) {
        return await blogRepository.paginate(filters, page, limit, { createdAt: -1 }, null, summaryFields);
    }

    /**
     * Publish or unpublish a blog post.
     * @param {String|ObjectId} slugOrId - Slug or ID of the blog.
     * @param {Boolean} publish - True to publish, false to unpublish.
     * @returns {Promise<Object>} The updated blog document.
     */
    async setPublishStatus(slugOrId, publish) {
        const result = await blogRepository.setPublishStatus(slugOrId, publish);
        if (!result) throw customError("Blog not found", 404);
        return result;
    }

    /**
     * Deletes a blog by its MongoDB ObjectId.
     * @param {String|ObjectId} id - The ID of the blog to delete.
     * @returns {Promise<Object|null>} The deleted blog document, or null if not found.
     */
    async deleteBlog(id) {
        const result = await blogRepository.deleteById(id);
        return result;
    }
}

module.exports = new BlogService();
