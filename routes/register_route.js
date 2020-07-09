const express = require('express');
const RegisterController = require('../controllers/register_controler');
const bodyValidator = require('../util/body_validator')

const router = express.Router();

//User registration route
router.post('/user', RegisterController.validate('body'), bodyValidator, RegisterController.registerUser);

//Customer registration route
router.post('/customer', RegisterController.registerCustomer);

module.exports = router;
