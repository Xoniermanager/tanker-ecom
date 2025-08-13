const {Router} = require("express")
const authorize = require("../middlewares/auth")
const {validateProduct} = require('../middlewares/validation')
const productController = require('../controllers/product.controller')


const router = Router()

router.route('/').get(authorize(['admin']), validateProduct, productController.createProduct)


module.exports = router