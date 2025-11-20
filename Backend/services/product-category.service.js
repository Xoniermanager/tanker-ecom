const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");
const ProductCategoryRepository = require("../repositories/product/product-category.repository")
const customResponse = require('../utils/response');
const { default: mongoose } = require("mongoose");
const projections = "name slug status description createdAt updatedAt"



class productCategoryService {
   
    async createProductCategory(data){
         const session = await mongoose.startSession()
         try {
            session.startTransaction()
            const isExist = await ProductCategoryRepository.findBySlug(data.slug, session)
            console.log("isExist: ", isExist)

         if(isExist) { throw customError("This product slug already exist, please use different", 400)}

            const newCategory = await ProductCategoryRepository.create(data, session)
            await session.commitTransaction()
            return newCategory
         } catch (error) {
            await session.abortTransaction()
            throw error
         }
         finally{
            session.endSession()
         }
        
        
        
    }

    async getAllCategory(page, limit, filters = {}){
        try {
            const query = {}
            if(filters.name){
               query.name = { $regex: filters.name, $options: "i" };
            }

            if(filters.slug){
                query.slug = {$regex: query.slug, $options: "i"}
            }
            const result = await ProductCategoryRepository.paginate(query, page, limit, {createdAt:-1}, null, projections)
            return result
        } catch (error) {
            throw error
        }
    }

    async getAllActiveCategory(filters = {}, session = null){
        try {
            const result = await ProductCategoryRepository.findActiveCategories(filters,projections, {createdAt: -1}, session)
            return result
        } catch (error) {
            throw error
        }
    }

    async getCategoryById(id){
        try {
            const result = await ProductCategoryRepository.findById(id)
            return result
        } catch (error) {
            throw error
        }
    }

    async updateCategoryById(id, payload){
        try{
          const result = await ProductCategoryRepository.update(id, payload)
          return result
        }
        catch(error){
            throw error
        }
    }

    async changeCategoryStatusById(id){
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const category = await ProductCategoryRepository.findById(id, session)
            console.log('category: ', category)

            const updatedStatus = (category.status === true) ? false : true;
            console.log("status: ", updatedStatus)
            
            const updatedCategory = await ProductCategoryRepository.updateCategoryStatus(id, updatedStatus, session)
            
            await session.commitTransaction();
            return updatedCategory


        } catch (error) {
            await session.abortTransaction()
            throw error
        }
        finally{
            session.endSession()
        }
    }

    async deleteCategoryById(id){
        try {
            const result = await ProductCategoryRepository.deleteById(id)
            return result
        } catch (error) {
            throw error
        }
    }
}

module.exports = new productCategoryService()