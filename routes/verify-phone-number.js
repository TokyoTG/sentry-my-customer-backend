const express = require('express');
const router = express.Router();
const verifyController = require("./../controllers/verify-controller");
const auth = require('../auth/auth');

router.post('/auth/verify', auth, verifyController.verifyPhone);
router.post('/auth/verify-phone', auth, verifyController.initialverification);

module.exports = router
