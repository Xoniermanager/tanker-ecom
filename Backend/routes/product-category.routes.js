const {Router} = require('express')
const authorize = require("../middlewares/auth");
const {validateProductCategory} = require('../middlewares/validation')
// const {} = require('../controllers/')

const router = Router()

router.route('/').get(authorize(['admin']), validateProductCategory, )

module.exports = router











