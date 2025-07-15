const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger.config');

const router = express.Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
