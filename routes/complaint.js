const express = require("express");
const router = express.Router();
const complaintsController = require("../controllers/complaints.controller");
const auth = require("../auth/auth");

// Get all complaints
router.get("/complaint/all", auth, complaintsController.findAll);

// Update a complaint
router.put("/complaint/update/:id", auth, complaintsController.update);

// Create a new complaint
router.post("/complaint/new", auth, complaintsController.newComplaint);

// Delete a complaint
router.delete("/complaint/delete/:id", auth, complaintsController.deleteOne);

module.exports = router;
