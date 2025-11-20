
const customResponse = require("../utils/response");
const productCategoryService = require('../services/product-category.service');


class ProductCategoryController {

    async createCategory(req,res, next){
        try {
            const payload = req.body;
            const category = await productCategoryService.createProductCategory(payload)
            return customResponse(res, 'product category created successfully', category)
        } catch (error) {
            next(error)
        }
    }

    async getAllCategories(req,res,next){
        try {
            const {page = 1, limit = 10, ...filters} = req.query;
           const result = await productCategoryService.getAllCategory(page, limit, filters);
           return customResponse(res, "Category data get successfully", result)
        } catch (error) {
            next(error)
        }
    }

    async getAllActiveCategories(req,res,next){
        try {
            const result = await productCategoryService.getAllActiveCategory({status:true})
            return customResponse(res, "Active category data get successfully", result)
        } catch (error) {
            next(error)
        }
    }

    async getById(req,res,next){
        try {
            const {id} = req.params;

            const result = await productCategoryService.getCategoryById(id)
            return customResponse(res, "Category data get successfully", result)
        } catch (error) {
            next(error)
        }
    }

    async updateCatById(req,res,next){
        try {
            const {id} = req.params;
            const payload = req.body;
            const result = await productCategoryService.updateCategoryById(id, payload)
            return customResponse(res, "Category updated successfully", result)
            return
        } catch (error) {
            next(error)
        }
    }

    async updateCatStatusById(req,res,next){
        try {
            const {id} = req.params
            const result = await productCategoryService.changeCategoryStatusById(id)
            return customResponse(res, `category status changed ${result.status} successfully `, result)
        } catch (error) {
            next(error)
        }
    }

    async deleteCategoryById(req,res,next){
        try {
            const {id} = req.params
            const result = await productCategoryService.deleteCategoryById(id)
            return customResponse(res, "Category deleted successfully", result)
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new ProductCategoryController()