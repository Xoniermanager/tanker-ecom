const {Router} = require("express")

const {validateOrder} = require('../middlewares/validation')
const authorize = require("../middlewares/auth")
const orderController = require("../controllers/order.controller")

const router = Router()

router.route('/').post(validateOrder, authorize(['user', 'admin']), orderController.createOrder).get(authorize(['user', 'admin']), orderController.getAll)



module.exports = router