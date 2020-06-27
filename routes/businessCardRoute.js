const router = require("express").Router();
const verifyToken = require("../auth/auth");
const businessCards = require("../controllers/businessCards");

router.get("/business-cards", verifyToken, businessCards());

module.exports = router;
