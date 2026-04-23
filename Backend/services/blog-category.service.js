const mongoose = require("mongoose");
const categoryRepository = require("../repositories/cms/blog-category.repository");
const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");
const blogRepository = require("../repositories/cms/blog.repository")

class BlogCategoryService {
    constructor(){
        this.blogRepo = blogRepository
    }
    /**
     * Get all blog categories (no pagination).
     * @param {Object} filters 
     * @returns {Promise<Array>}
     */
    async getAllCategories(filters = {}) {
        const query = {};

        if (filters.name) {
            query.name = { $regex: filters.name, $options: "i" };
        }

        return await categoryRepository.findAll(query, null, { createdAt: -1 });
    }

    /**
     * Get a category by slug (public view).
     * @param {String} slug 
     * @returns {Promise<Object>}
     */
    async getCategoryBySlug(slug) {
        const category = await categoryRepository.findBySlug(slug);
        if (!category) {
            throw customError(`Category not found with slug ${slug}`, 404);
        }
        return category;
    }

    /**
     * Create a new blog category.
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async createCategory(data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            data.slug = await generateSlugIfNeeded(data.name, data.slug, categoryRepository, session);
            const result = await categoryRepository.create(data, session);

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
     * Update an existing blog category.
     * @param {String|ObjectId} id 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async updateCategory(id, data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            if (!data.slug && data.title) {
                data.slug = await generateSlugIfNeeded(data.title, null, categoryRepository, session);
            }

            const result = await categoryRepository.update(id, data, session);

            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();  
        }
    }

    
    async deleteCategory(id) {
        try{
          if(!mongoose.Types.ObjectId.isValid(id)){
            throw customError("Invalid object id", 400)
          }
          const isExist = await this.blogRepo.FindByCategory(id)
          if(isExist){
            throw customError(`This category are used in ${isExist?.title ?? ""} blog so please change blog category first`, 400)
          }
          const deleted = await categoryRepository.deleteById(id);
          
          if(!deleted){
            throw customError(`Category deletion failed`)
          }


         return deleted;
        } catch(err){
            throw err
        }
        
    }
}

module.exports = new BlogCategoryService();
