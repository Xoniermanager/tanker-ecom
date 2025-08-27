
const orderService = require("../services/order.service")
const customResponse = require("../utils/response")



class OrderController {

    createOrder = async(req, res, next)=>{
        try {
            const userId = req.user._id
            const payload = {...req.body, user: userId}
            const response = await orderService.createOrder(payload)
            return customResponse(res, "Order created successfully", response)
        } catch (error) {
            next(error)
        }
    }

    getAll = async(req,res,next)=>{
        try {
            const result = await orderService.getAll()
            return customResponse(res, "All order get successfully", result)
        } catch (error) {
            next(error)
        }
    }

    
}


const orderController = new OrderController()

module.exports = orderController