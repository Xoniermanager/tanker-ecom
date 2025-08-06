const BlogCategory = require("../../models/cms/blog-category.model");
const BaseRepository = require("../base.repository");

/**
 * Repository for managing blog categories.
 */
class BlogCategoryRepository extends BaseRepository {
    constructor() {
        super(BlogCategory);
    }

    /**
     * Finds a blog category by its slug.
     * @param {string} slug - The slug of the blog category.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} The blog category with full thumbnail path if found, otherwise null.
     */
    async findBySlug(slug, session = null) {
        const category = await this.model.findOne({ slug }).session(session);
        if (!category) return null;

        const categoryObj = category.toObject();

        if (categoryObj.thumbnail?.source) {
            categoryObj.thumbnail.fullPath = getPublicFileUrl(categoryObj.thumbnail.source);
        }

        return categoryObj;
    }
}

module.exports = new BlogCategoryRepository();
