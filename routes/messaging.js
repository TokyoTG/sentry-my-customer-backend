const express = require('express');
const router = express.Router();
const messageController = require("../controllers/messageController");
const jwt = require('jsonwebtoken')

const auth = require('../auth/auth');
router.post('/reminder/sms/:customer_id', auth, messageController.sendMessage);

module.exports = router;
