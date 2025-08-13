
const productService = require('../services/product.service');
const customResponse = require('../utils/response');



class productController {

    createProduct = async(req,res)=>{
        try {
            const payload = req.body;
            const result = await productService.createProduct(payload)
            return customResponse(res, "Product created successfully", result)
        } catch (error) {
            next(error)
        }
    }

}


module.exports = new productController()