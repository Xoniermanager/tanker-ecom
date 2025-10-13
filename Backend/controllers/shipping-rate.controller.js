const shippingRateService = require("../services/shipping-rate.service");
const customResponse = require("../utils/response");

class ShippingRateController {
    constructor(){
        this.service = shippingRateService
    }

    getShippingRate = async(req, res, next) =>{
        try {
            const payload = req.body;
            const response = await this.service.getShippingRate(payload)
            return customResponse(res, "Shipping rate fetched successfully", response)
        } catch (error) {
            next(error)
        }
    }



}

const shippingRateController = new ShippingRateController()

module.exports = shippingRateController