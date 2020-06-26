const express = require("express");
const router = express.Router();
const authController = require('../auth/auth')
const complaintsController = require("../controllers/complaints.controller");

// Get all complaints
router.get("/complaint/all", complaintsController.findAll);

// Update a complaint
router.put("/complaint/update/:id", complaintsController.update);

// Create a new complaint
router.post("/complaint/new", authController, complaintsController.newComplaint);

// Delete a complaint
router.delete("/complaint/delete/:id", complaintsController.deleteOne);

module.exports = router;
