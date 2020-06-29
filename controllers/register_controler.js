const jwt = require("jsonwebtoken");
const bCrypt = require('bcryptjs');
const { body } = require('express-validator/check');

const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');

exports.validate = (method) => {
  switch (method) {
      case 'body': {
          return [
              body('phone_number').isInt(),
              body('first_name').isLength({ min: 3 }),
              body('last_name').isLength({ min: 3 }),
              body('email').matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "i"),
              body('password').matches(/^[0-9a-zA-Z]{6,}$/, "i"),
          ]
      }
  }
}

//  Register User
module.exports.registerUser = async (req, res, next) => {
    const { email, first_name, last_name, password, phone_number } = req.body;

    //  Create a Token that will be passed as the "api_token"
    const token = await jwt.sign({
        name: first_name + last_name,
        phone_number: phone_number,
        email: email,
    }, process.env.JWT_KEY, {
        expiresIn: "1d",
    });


    //  Get instance of the
    const user = new UserModel({
        phone_number: phone_number,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        api_token: token
    });

    //  Encrypt the Password
    user.password = await bCrypt.hash(user.password, 12);


    //  Check if User PhoneNumber and Email already exist.
    await UserModel.findOne({ phone_number: user.phone_number, email: user.email })
        .then((existingUser) => {
            if(existingUser) {
                //  This means the user exists.
                return res.status(200).json({
                    Message: "Email or phone number already taken. Please use another email or phone number."
                });
            }
            else {
                //  Save to the DB.
                user.save()
                    .then((result) => {
                        res.status(201).json({
                            Message: "User registered successfully...",
                            User: {
                                _id: result._id,
                                phone_number: result.phone_number, 
                                first_name: result.first_name, 
                                last_name: result.last_name, 
                                email: result.email, 
                                is_active: result.is_active,
                                api_token: result.api_token, 
                                user_role: result.user_role,
                            },
                        });

                        //  TODO Redirect to the OTP Activation Page.
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            Error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
};

//  Register Customer
module.exports.registerCustomer = async (req, res, next) => {
    const { name, phone_number } = req.body;

    const reqBody = {
        phone_number: phone_number,
        name: name,
    };


    //Validate the "reqBody" object using joiValidator function imported.
    const {error, value} = await joiValidator.customerValidator.validate(reqBody);
    //  Check if there is any validation error.
    if (error) {
        return res.status(400).json({
            Error: error.details[0].message,
        });
    }

    //  Get instance of the
    const customer = new CustomerModel({
        name: value.name,
        phone_number: value.phone_number,
        /*store_ref_code: store_ref_code,*/
    });

    //  Check if User PhoneNumber already exist.
    await UserModel.findOne({ phone_number: customer.phone_number })
        .then((existingUser) => {
            if(existingUser) {
                //  This means the user exists.
                return res.status(200).json({
                    Message: "Phone number already taken. Please use another phone number."
                });
            }
            else {
                //  Save to the DB.
                customer.save()
                    .then((result) => {
                        return res.status(201).json({
                            Message: "Customer registered successfully...",
                            Customer: {
                                _id: result._id,
                                name: result.name,
                                phone_number: result.phone_number,
                                store_ref_code: result.store_ref_code,
                            },
                        });
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            Error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
};
