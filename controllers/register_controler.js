const jwt = require("jsonwebtoken");
const bCrypt = require('bcryptjs');
const joiValidator = require('../util/joi_validator');

const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');

//  Register User
module.exports.registerUser = async (req, res, next) => {
    const { email, first_name, last_name, password, phone_number } = req.body;

    try {

        // check if user exists 
        let user = await UserModel.find({ $or: [{ phone_number: user.phone_number }, { email: user.email }] })
        if (user) {
            res.status(400).json({
                Message: "Email or phone number already taken. Please use another email or phone number."
            });
        }

        const reqBody = {
            phone_number: phone_number,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
        };


        //Validate the "reqBody" object using joiValidator function imported.
        const { error, value } = await joiValidator.userRegistrationValidator.validate(reqBody);
        //  Check if there is any validation error.
        if (error) {
            return res.status(400).json({
                Error: error.details[0].message,
            });
        }

        //  Create a Token that will be passed as the "api_token"
        const token = await jwt.sign({
            name: value.first_name + value.last_name,
            phone_number: value.phone_number,
            email: value.email,
        }, process.env.JWT_KEY, {
            expiresIn: "1d",
        });

        //  Encrypt the Password
        const userPassword = await bCrypt.hash(value.password, 12);

        //  Get instance of the
        user = new UserModel({
            phone_number: value.phone_number,
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            password: userPassword,
            token: token,
        });

        // save to DB 
        await user.save()

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
    } catch (error) {
        res.status(500).json({ Error: error });
    }


};

//  Register Customer
module.exports.registerCustomer = async (req, res, next) => {
    const { name, phone_number } = req.body;

    const reqBody = {
        phone_number: phone_number,
        name: name,
    };


    //Validate the "reqBody" object using joiValidator function imported.
    const { error, value } = await joiValidator.customerValidator.validate(reqBody);
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
            if (existingUser) {
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
