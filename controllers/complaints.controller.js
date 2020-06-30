const Complaint = require("../models/complaint_form");
const User = require("../models/user");

// Retieves all complaints
exports.findAll = async (req, res) => {
  try {
    await Complaint.find()
      .sort({ createdAt: -1 })
      .then(async complaints => {
        const finalResponse = [];
        for (const iterator of complaints) {
          const item = iterator.toJSON();
          if (item.user_ref_id) {
            const user = await User.findById(item.user_ref_id);
            item.customer_first_name = user.first_name ? user.first_name : '';
            item.customer_last_name = user.last_name ? user.last_name : '';
            item.customer_email = user.email? user.email : '';
          }
          finalResponse.push(item);
        }
        res.status(200).send({
          status: true,
          message: 'Complains loaded',
          data: finalResponse
        });
      });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error occured while retriving complaints",
      data: {
        message: "Error occured while retriving complaints"
      }
    });
  }
};

// update complaint
exports.update = async (req, res) => {
  // validating the message
  if (!req.body.message || "") {
    return res.status(404).send({
      status: false,
      message: "Message field canot be empty",
      data: {
        message: "Message field canot be empty"
      }
    });
  }

  try {
    // update complaint
    let complaint = await Complaint.findByIdAndUpdate(req.params.id, {
      message: req.body.message,
      status: req.body.status
    });

    if (!complaint) {
      res.status(404).send({
        status: false,
        message: "Complaint not found",
        data: {
          message: "Complaint not found"
        }
      });
    }

    res.status(200).send({
      success: true,
      message: "Complaint successfully updated",
      data: {
        message: "Complaint successfully updated"
      }
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error updating compliant",
      data: err
    });
  }
};

// delete a complaint
exports.deleteOne = async (req, res) => {
  try {
    let complaint = await Complaint.findByIdAndRemove(req.params.id);

    if (!complaint) {
      res.status(404).send({
        success: false,
        message: "Complain not found",
        error: {
          message
        }
      });
    }

    res.status(200).send({
      success: true,
      message: "Complaint deleted successfully",
      data: {
        message: "Complaint deleted successfully"
      }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error deleting complaint",
      error: err
    });
  }
};

// create and register new complaint
exports.newComplaint = async (req, res) => {
  // validate message field
  const { message, store } = req.body;
  const { email } = req.user;

  if (!message) {
    return res.status(404).send({
      success: false,
      message: "Message field canot be empty",
      error: {
        message: "Message field canot be empty"
      }
    });
  }

  if (!store) {
    return res.status(404).send({
      success: false,
      message: "Store reference ID is required",
      error: {
        message: "Store reference ID is required"
      }
    });
  }

  const user = await User.findOne({ email });

  try {
    // create new complaint
    let complaint = await new Complaint({
      user_ref_id: user._id,
      message,
      store_ref_code: store
    });

    let result = await complaint.save();

    res.status(200).json({
      success: true,
      message: 'New complain addedd',
      data: result
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Unable to add new complain',
      error: err
    });
  }
};
