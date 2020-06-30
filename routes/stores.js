const express = require("express");
const router = express.Router();
const storeController = require("./../controllers/stores");
const auth = require('../auth/auth');

router.post("/store/new/:current_user",auth, storeController.createStore);
router.get("/store/all/:current_user", auth, storeController.getAllStores);
router.get("/store/:store_id", auth, storeController.getStore);
router.patch("/store/update/:store_id", auth, storeController.updateStore);
router.delete("/store/delete/:store_id", auth, storeController.deleteStore);

module.exports = router;
