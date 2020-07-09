const Complaint = require("../models/complaint_form");
// const User = require("../models/user");

const StoreOwner = require('../models/store_admin');
const { check, validationResult } = require('express-validator/check');

// @route       GET /complaints/:ownerId
// @desc        Store admin retrieves all Complaints
// @access      Private
exports.findAll = async (req, res) => {
  
  // Finds all complaints pertaining to store owner
  try {

    const store_admin_id = req.params.ownerId;
  
    const storeAdmin = await StoreOwner.findById(store_admin_id);

    res.status(200).send({
      success: true,
      message: "All complaints",
      data: {
        statusCode: 200,
        complaints: storeAdmin.complaints
      }
    });
    
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching complaints",
      data: {
        statusCode: 422,
        error: error.message
      }
    });
  }
};

// @route       GET /complaint/:ownerId
// @desc        Retrieve a single complaint
// @access      Private
exports.findOne = async (req, res) => {

  try {
    const { ownerId, complaintId } = req.params;

    const storeAdmin = await StoreOwner.findById(ownerId);

    const complaint = storeAdmin.complaints.id(complaintId);

    if (!complaint) {
      res.status(422).send({
        success: false,
        message: "Error fetching complaint",
        data: {
          statusCode: 422,
          error: error.message
        }
      });
    }

    res.status(200).send({
      success: true,
      message: "Complaint fetched",
      data: {
        statusCode: 200,
        complaint
      }
    });
    
  } catch (error) {
    res.status(422).send({
      success: false,
      message: "Error fetching complaint",
      data: {
        statusCode: 422,
        error: error.message
      }
    });
  }
}

// @route       PUT /complaints/update/:ownerId
// @desc        Update an existing complaint
// @access      Public
exports.update = async (req, res) => {
  const { complaint_id, name, email, message } = req.body;
  const store_admin_id = req.params.ownerId;

  try {
    const storeAdmin = await StoreOwner.findById(store_admin_id);

    const complaints  = storeAdmin.complaints;

    const complaint = complaints.id(complaint_id);

    complaint.name = name ? name : complaint.name;
    complaint.email = email ? email : complaint.email;
    complaint.message = message ? message : complaint.message;

    await storeAdmin.save();

    res.status(200).send({
      success: true,
      message: "Complaint updated",
      data: {
        statusCode: 200,
        complaint
      }
    });
    
  } catch (error) {
    res.status(422).send({
      success: false,
      message: "Error updating complaint",
      data: {
        statusCode: 422,
        error: error.message
      }
    });
  }
};

// create and register new complaint
// @route       DELETE /complaint/delete/:ownerId
// @desc        Delete one complaint
// @access      Private
exports.deleteOne = async (req, res) => {
  
  try {    
    const { ownerId, complaintId } = req.params;

    const storeAdmin = await StoreOwner.findById(ownerId);

    const complaints  = storeAdmin.complaints;

    const complaint = complaints.id(complaintId);
    
    complaint.remove();

    await storeAdmin.save();

    res.status(200).send({
      success: true,
      message: "Complaint successfully deleted",
      data: {
        statusCode: 200, 
        complaint
      }
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting complaint",
      data: {
        statusCode: 500,
        error: error.message
      }
    });
  }
};

// create and register new complaint
// @route       POST /complaint/new/:ownerId
// @desc        Public creates complaints to store Owner admins
// @access      Public
exports.newComplaint = async (req, res) => {

  // Validate body request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Deconstruct req body
  const { name, email, message } = req.body

  try {
    // Get Store Owner Id from the URL Parameter
    let urlStoreOwner = await StoreOwner.findById(req.params.ownerId);

    // If Id exists, create complaint
    let newComplaint = await Complaint({
      name, 
      email,
      message,
      storeOwner: req.params.ownerId
    })

    urlStoreOwner.complaints.push(newComplaint);

    const complaint = await urlStoreOwner.save();

    // let comp = null;

    res.json({
      success: true,
      message: "Complaint successfully sent to store owner!",
      data: {
        statusCode: 200,
        complaint: newComplaint
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: "Server Error. Store Owner Id doesn't exist!",
      data: {
        statusCode: 500,
        error: err.message
      }
    });
  }
};
