const express = require("express");
const router = express.Router();
const complaintsController = require("../controllers/complaints.controller");
const auth = require("../auth/auth");
const { check, validationResult } = require('express-validator/check');

// Get all complaints
router.get("/complaints/:ownerId", auth, complaintsController.findAll);

// Get a single complaint
router.get("/complaint/:ownerId/:complaintId", auth, complaintsController.findOne)

// Update a complaint
router.put("/complaint/update/:ownerId", complaintsController.update);

// Create a new complaint
// // create and register new complaint
// @route       POST /complaint/new/:ownerId
// @desc        Public creates complaints to store Owner admins
// @access      Public
router.post(
    "/complaint/new/:ownerId", 
    [
        check('name', 'Please add a name').not().isEmpty(),
        check('email', 'Please add a valid email').isEmail(),
        check('message', 'Please add a message of more that 10 characters').isLength({ min: 10 })
    ],
    complaintsController.newComplaint
);

// Delete a complaint
router.delete("/complaint/delete/:ownerId/:complaintId", auth, complaintsController.deleteOne);

module.exports = router;
