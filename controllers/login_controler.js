const jwt = require("jsonwebtoken");
const bCrypt = require('bcryptjs');
const joiValidator = require('../util/joi_validator');

const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');

//  Login User
module.exports.loginUser = async (req, res, next) => {
    const { password, phone_number } = req.body;

    const reqBody = {
        phone_number: phone_number,
        password: password,
    };


    //Validate the "reqBody" object using joiValidator function imported.
    const {error, value} = await joiValidator.userLoginValidator.validate(reqBody);
    //  Check if there is any validation error.
    if (error) {
        return res.status(400).json({
            Error: error.details[0].message,
        });
    }

    //  Get instance of the
    const user = UserModel({
        password: value.password,
        phone_number: value.phone_number,
    });

    //  Check if the users phone persists in the DB
    await UserModel.findOne({ phone_number: user.phone_number, })
        .then((userExist) => {
            if (userExist) {
                //  Go ahead to compare the password match.
                bCrypt.compare(user.password, userExist.password)
                    .then((doPasswordMatch) => {
                        if (doPasswordMatch) {
                            //  Generate a login api_token for subsequent authentication.
                            const apiToken = jwt.sign({
                                phone_number: userExist.phone_number,
                                email: userExist.email,
                                password: user.password,
                                is_active: userExist.is_active,
                                user_role: userExist.user,
                            }, process.env.JWT_KEY, {
                                expiresIn: "1h",
                            });
                            res.status(200).json({
                                message: "You're logged in successfully.",
                                api_token: apiToken,
                                status: true,
                                user: {
                                    _id: userExist._id,
                                    phone_number: userExist.phone_number,
                                    first_name: userExist.first_name,
                                    last_name: userExist.last_name,
                                    email: userExist.email,
                                    is_active: userExist.is_active,
                                    password: userExist.password,
                                    user_role: userExist.user_role,
                                }
                            });
                        }
                        else {
                            res.json({
                                message: "Invalid Password.",
                                status: false,
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            Error: error,
                        });
                    });
            }
            else {
                res.json({
                    Message: "Invalid phone number.",
                    Status: false,
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
};


//  Login Customer
module.exports.loginCustomer = async (req, res, next) => {
    const { name, phone_number } = req.body;

    const reqBody = {
        phone_number: phone_number,
        name: name,
    };


    //Validate the "reqBody" object using joiValidator function imported.
    const {error, value} = await joiValidator.userLoginValidator.validate(reqBody);
    //  Check if there is any validation error.
    if (error) {
        return res.status(400).json({
            Error: error.details[0].message,
        });
    }

    //  Get instance of the
    const user = CustomerModel({
        name: value.name,
        phone_number: value.phone_number,
    });

    //  Check if the users phone persists in the DB
    await CustomerModel.findOne({ phone_number: user.phone_number })
        .then((userExist) => {
            if (userExist) {
                //  Go ahead to generate a login api_token for subsequent authentication..
                const apiToken = jwt.sign({
                    phone_number: userExist.phone_number,
                    name: userExist.name,
                }, process.env.JWT_KEY, {
                    expiresIn: "1h",
                });

                res.status(200).json({
                    message: "You're logged in successfully.",
                    api_token: apiToken,
                    status: true,
                    user: {
                        _id: userExist._id,
                        phone_number: userExist.phone_number,
                        name: userExist.name,
                    }
                });
            }
            else {
                res.json({
                    Message: "Invalid phone number.",
                    Status: false,
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
};


//  Login User
module.exports.login

