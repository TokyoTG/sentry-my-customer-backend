const express = require('express');
const router = express.Router();
const customerController = require("./../controllers/customer.controller.js");
const jwt = require('jsonwebtoken')

const auth = require('../auth/auth');
router.post('/customer/new', customerController.validate('body'), customerController.create)
router.get('/customer/all', auth, customerController.getAll)
router.put('/customer/update/:customerId', customerController.validate('body'), customerController.updateById)
router.delete('/customer/delete/:customerId', auth, customerController.deleteById)
router.get('/customer/:customerId', auth, customerController.getById)

module.exports = router
