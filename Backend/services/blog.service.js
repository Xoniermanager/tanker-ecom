const mongoose = require("mongoose");
const { Types, startSession } = require('mongoose');
const blogRepository = require("../repositories/cms/blog.repository");
const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");
const { getBucketImageKey, deleteImage } = require("../utils/storage");
const summaryFields = 'title subtitle slug thumbnail tags categories createdAt isPublished author';

class BlogService {

    async getAllBlogs(page = 1, limit = 10, filters = {}) {
        const query = {};

        if (filters.tags) {
            const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
            query.tags = { $in: tags };
        }

        if (filters.categories) {
            const categories = Array.isArray(filters.categories) ? filters.categories : [filters.categories];

            const categoryObjectIds = categories.map(id => {
                try {
                    return new Types(id);
                } catch {
                    return null;
                }
            }).filter(Boolean); 

            query.categories = { $in: categoryObjectIds };
        }

        if (filters.title) {
            query.title = { $regex: filters.title, $options: 'i' }; 
        }

        if (filters.isPublished) {
            query.isPublished = filters.isPublished;
        }

        return await blogRepository.paginate(
            query,
            page,
            limit,
            { createdAt: -1 },
            null,
            summaryFields,
            {
                path: 'categories',
                select: '_id name slug',
            }
        );
    }

  
    async getPublishedBlogBySlug(slug) {
        try{
         const blog = await blogRepository.findBySlug(slug);
        if (!blog) {
            throw customError(`Blog not found with slug ${slug}`);
        }
        return blog;
        }
        catch(err){
            throw err
        }
       
    }

   
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

   
    async getBlogsByAuthor(userId) {
        return await blogRepository.findByAuthor(userId, summaryFields);
    }

   
    async getPublishedBlogs(page = 1, limit = 10, filters = {}) {
        return await blogRepository.paginate(filters, page, limit, { createdAt: -1 }, null, summaryFields);
    }

   
    async setPublishStatus(slugOrId, publish) {
        const result = await blogRepository.setPublishStatus(slugOrId, publish);
        if (!result) throw customError("Blog not found", 404);
        return result;
    }

    
    async deleteBlog(id) {
        const session = await startSession();
        try{
            session.startTransaction();
        const item = await blogRepository.findById(id, session);
       
  
        if(item.thumbnail.source){
            const key = getBucketImageKey(item.thumbnail.source);
            await deleteImage(key);
        }
      
        const result = await blogRepository.deleteById(id, session);
        await session.commitTransaction();
        return result;
    }
    catch (err){
        await session.abortTransaction();
        throw err;
    } finally{
        await session.endSession();
    }
    }
}

module.exports = new BlogService();
