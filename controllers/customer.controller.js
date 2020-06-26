const Customer = require("../models/customer");
const { body, validationResult } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'body': {
            return [
                body('name').isLength({ min: 3 }),
                body('phone').isInt()
            ]
        }
    }
}

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ status: "fail", errors: errors.array() });
  }
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      status: "fail",
      message: "Transaction content can not be empty",
    });
  }

  const customer = new Customer({
    name: req.body.name,
    phone_number: req.body.phone,
  });

  const result = await customer.save();

  res.status(200).json({
    status: "success",
    data: {
      id: customer._id,
      name: customer.name,
      phone: customer.phone_number,
    },
  });
};

exports.getById = (req, res) => {
  try {
    Customer.findById(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).send({
          status: "fail",
          message: error.message,
        });
      } else {
        res.status(200).json({
          status: "success",
          data: {
            id: customer._id,
            name: customer.name,
            phone: customer.phone_number,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateById = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: "fail", errors: errors.array() });
  }

  Customer.updateOne({ _id: req.params.customerId }, { $set: {
    name: req.body.name,
    phone_number: req.body.phone,
  }})
    .exec()
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: {
          id: req.params.customerId,
          name: req.body.name,
          phone: req.body.phone,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteById = (req, res) => {
  try {
    Customer.findByIdAndDelete(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).json({
          status: "fail",
          //message: error.message,
        });
      } else if (!customer) {
        res.status(404).json({
          status: "fail",
          message: "Not found",
        });
      } else {
        res.status(200).json({
          status: "success",
          data: {
            id: customer._id,
            name: customer.name,
            phone: customer.phone_number,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let customers = await Customer.find().select("-__v").sort({
      createdAt: -1,
    });
    if (!customers) {
      return next(new Error("Something went wrong"));
    }

    res.status(200).json({
      status: "success",
      result: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
