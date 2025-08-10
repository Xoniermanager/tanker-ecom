
const customResponse = require("../utils/response");

class ProductCategoryController {

    createCategory(req,res, next){
        try {
            const payload = req.body;
            customResponse(res, 'product category created successfully')
        } catch (error) {
            next(error)
        }
    }

}