const {Router} = require('express')
const authorize = require("../middlewares/auth");
const {validateProductCategory} = require('../middlewares/validation')
const ProductCategoryController = require('../controllers/product-category.controller')


const router = Router()


router.route('/').get(authorize(['admin']),ProductCategoryController.getAllCategories)
router.route('/active').get(ProductCategoryController.getAllActiveCategories)
router.route('/:id').get(ProductCategoryController.getById)
router.route('/').post(authorize(['admin']), validateProductCategory, ProductCategoryController.createCategory)
router.route('/update/:id').put(authorize(['admin']), validateProductCategory, ProductCategoryController.updateCatById )
router.route('/status/:id').patch(authorize(['admin']), ProductCategoryController.updateCatStatusById)
router.route("/delete/:id").delete(authorize(['admin']), ProductCategoryController.deleteCategoryById)

module.exports = router











