const Blog = require("../../models/cms/blog.model");
const BaseRepository = require("../base.repository");
const { getPublicFileUrl } = require("../../utils/storage");

/**
 * Repository for managing blog posts.
 */
class BlogRepository extends BaseRepository {
    constructor() {
        super(Blog);
    }

    /**
     * Finds a blog by its slug.
     * @param {string} slug - The slug of the blog.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} The blog with full thumbnail path if found, otherwise null.
     */
    async findBySlug(slug, session = null) {
        const blog = await this.model.findOne({ slug }).populate({
            path: 'categories',
            select: '_id name slug',
        }).session(session);
        if (!blog) return null;

        const blogObj = blog.toObject();

        if (blogObj.thumbnail?.source) {
            blogObj.thumbnail.fullPath = getPublicFileUrl(blogObj.thumbnail.source);
        }

        return blogObj;
    }

    /**
     * Creates a new blog post.
     * @param {Object} data - Blog data.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object>} The newly created blog.
     */
    async createBlog(data, session = null) {
        const blog = new this.model(data);
        return blog.save({ session });
    }

    /**
     * Updates a blog by its ObjectId.
     * @param {ObjectId} id - MongoDB ObjectId.
     * @param {Object} data - Blog data to update.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} The updated blog or null if not found.
     */
    async updateBlog(id, data, session = null) {
        return this.model.findByIdAndUpdate(id, { $set: data }, { new: true, session });
    }

    /**
     * Returns all published blog posts with optional filter and projection.
     * @param {Object} [filter={}] - Additional filter criteria.
     * @param {String|Object} [projection=null] - Fields to include or exclude.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Array>} List of published blog posts.
     */
    async findPublished(filter = {}, projection = null, session = null) {
        return this.model
            .find({ isPublished: true, ...filter }, projection)
            .sort({ publishedAt: -1 })
            .session(session);
    }

    /**
     * Finds all blogs by a specific author with optional projection.
     * @param {ObjectId} userId - MongoDB user ID.
     * @param {String|Object} [projection=null] - Fields to include or exclude.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Array>} List of blogs written by the author.
     */
    async findByAuthor(userId, projection = null, session = null) {
        return this.model
            .find({ "author.userId": userId }, projection)
            .populate({
                path: 'categories',
                select: '_id name slug',
            })
            .session(session);
    }

    /**
     * Updates the publish status of a blog post.
     * @param {string|ObjectId} slugOrId - Slug string or MongoDB ObjectId.
     * @param {boolean} publish - True to publish, false to unpublish.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} The updated blog document or null if not found.
     */
    async setPublishStatus(slugOrId, publish, session = null) {
        const query = { _id: slugOrId };

        const update = publish
            ? { $set: { isPublished: true, publishedAt: new Date() } }
            : { $set: { isPublished: false }, $unset: { publishedAt: "" } };

        return this.model.findOneAndUpdate(query, update, { new: true, session });
    }
}

module.exports = new BlogRepository();
