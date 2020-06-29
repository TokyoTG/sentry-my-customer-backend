const Customer = require("../models/customer");
const UserModel = require("../models/user");
const { body } = require('express-validator/check');

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
  const customer = new Customer({
    name: req.body.name,
    phone_number: req.body.phone,
  });

  const result = await customer.save();

  res.status(201).json({
    status: true,
    message: "Customer was created",
    data: {
      statusCode: 201,
      customer: customer
    },
  });
};

exports.getById = (req, res) => {
  try {
    Customer.findById(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).send({
          status: false,
          message: error.message,
          error: {
            code: 404,
            message: error.message
          }
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer was found",
          data: {
            customer
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.updateById = (req, res) => {
  Customer.updateOne({ _id: req.params.customerId }, { $set: {
    name: req.body.name,
    phone_number: req.body.phone,
  }})
    .exec()
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Customer was updated",
        data: {
          customer: {
            id: req.params.customerId,
            name: req.body.name,
            phone: req.body.phone,
          }
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
        error: {
          code: 500,
          message: error.message
        }
      });
    });
};

exports.deleteById = (req, res) => {
  try {
    Customer.findByIdAndDelete(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).json({
          status: false,
          //message: error.message,
        });
      } else if (!customer) {
        res.status(404).json({
          status: false,
          message: "Customer not found",
          error: {
            code: 404,
            message: "Customer not found"
          }
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer was deleted",
          data: {
            customer: {
              id: customer._id,
              name: customer.name,
              phone: customer.phone_number,
            }
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let customers = await Customer.find().select("-__v").sort({
      createdAt: -1,
    });
    if (!customers) {
      res.status(404).json({
        status: false,
        message: "Customers not found",
        error: {
          code: 404,
          message: "Customers not found"
        }
      });
    }

    res.status(200).json({
      status: true,
      message: "Customers",
      data: {
        customers: customers
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};
