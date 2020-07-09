const express = require('express');
const LoginController = require('../controllers/login_controler');
const bodyValidator = require('../util/body_validator')

const router = express.Router();

//User registration route
router.post('/user', LoginController.validate('login'), bodyValidator, LoginController.loginUser);

//Customer registration route
router.post('/customer', LoginController.loginCustomer);

module.exports = router;
