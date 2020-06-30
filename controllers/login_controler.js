const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const { body } = require('express-validator/check');
const passport = require("passport");

const UserModel = require("../models/store_admin");
const CustomerModel = require("../models/customer");

exports.validate = (method) => {
  switch (method) {
      case 'login': {
          return [
              body('phone_number').isInt(),
              body('password').matches(/^[0-9a-zA-Z]{6,}$/, "i"),
          ]
      }
  }
}

//  Login User
module.exports.loginUser = async (req, res, next) => {
  const { password, phone_number } = req.body;

  //  Get instance of the
  const user = UserModel({});
  user.local.phone_number = phone_number;
  user.local.password = password;
  user.identifier = phone_number;

  //  Check if the users phone persists in the DB
  await UserModel.findOne({ identifier: user.identifier })
    .then((userExist) => {
      if (userExist) {
        //  Go ahead to compare the password match.
        bCrypt
          .compare(user.local.password, userExist.local.password)
          .then((doPasswordMatch) => {
            if (doPasswordMatch) {
              //  Generate a login api_token for subsequent authentication.
              const apiToken = jwt.sign(
                {
                  phone_number: userExist.local.phone_number,
                  password: user.local.password,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );
              res.status(200).json({
                success: true,
                message: "You're logged in successfully.",
                data: {
                  statusCode: 200,
                  user: userExist
                },
              });
            } else {
              res.json({
                message: "Invalid Password.",
                status: false,
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              Error: error,
              status: "fail"
            });
          });
      } else {
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
  const { error, value } = await joiValidator.userLoginValidator.validate(
    reqBody
  );
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
        const apiToken = jwt.sign(
          {
            phone_number: userExist.phone_number,
            name: userExist.name,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "You're logged in successfully.",
          api_token: apiToken,
          status: true,
          user: {
            _id: userExist._id,
            phone_number: userExist.phone_number,
            name: userExist.name,
          },
        });
      } else {
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

//Sign in with facebook
module.exports.fbLogin = passport.authenticate('facebook');

module.exports.fbLoginCallback = function (req, res) {
  if ( !req.user ) {
    res.status(401).send({
      success: false,
      message: "Login with facebook failed",
      error: {
        code: 401,
        message: "Login failed"
      }
    });
  } else {
    res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        user: req.user._json
      }
    });
  }
}

module.exports.login;
