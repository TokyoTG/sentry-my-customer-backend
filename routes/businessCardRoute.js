const router = require("express").Router();
const auth = require("../auth/auth");
const businessCards = require("../controllers/businessCards");

router.get("/business-cards", auth, businessCards());

module.exports = router;
