const {Router} = require('express')
const authorize = require('../middlewares/auth')
const {USER_ROLES} = require("../constants/enums");
const { shippingRate } = require('../middlewares/validation');
const shippingRateController = require("../controllers/shipping-rate.controller")


const router = Router();

router.route("/").post(authorize([USER_ROLES.ADMIN, USER_ROLES.USER]), shippingRate, shippingRateController.getShippingRate);


module.exports = router