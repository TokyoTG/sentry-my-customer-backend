const express = require('express');
const router = express.Router();
const otpController = require("./../controllers/otp.controller");

const auth = require('../auth/auth');

router.post('/otp/send', auth, otpController.send);
router.post('/otp/verify', auth, otpController.verify);

module.exports = router