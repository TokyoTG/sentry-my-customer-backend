const express = require('express');
const router = express.Router();
const FcaebookController = require('../controllers/facebook.controller')

router.get('/facebook/signin', FcaebookController.urlFacebook);
router.get('/facebook/callback', FcaebookController.getFacebookAccountFromCode);

module.exports = router
