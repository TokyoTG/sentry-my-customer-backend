const express = require("express");
const router = express.Router();
const emailController = require("./../controllers/emailController");
const auth = require("../auth/auth");
const pUpdate = require("../controllers/passwordupdate");

router.post("/reminder/email/:customer_id", auth, emailController.sendMail());
router.post("/update-password", auth, pUpdate());

module.exports = router;
