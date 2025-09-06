const {Router} = require("express");
const authorize = require('../middlewares/auth.js')

const dashboardController = require('../controllers/dashboard.controller.js')

const router = Router()

router.route('/').get(authorize(['admin']), dashboardController.getDashboardStatus);


module.exports = router