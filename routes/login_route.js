const express = require('express');
const LoginController = require('../controllers/login_controler');
const bodyValidator = require('../util/body_validator')

const router = express.Router();

//User registration route
router.post('/user', LoginController.validate('login'), bodyValidator, LoginController.loginUser);

//Customer registration route
router.post('/customer', LoginController.loginCustomer);

//Facebook sign in
router.get('/fb_login', LoginController.fbLogin, LoginController.fbLoginCallback)

module.exports = router;
