const User = require("../models/store_admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator/check");


exports.validate = method => {
  switch (method) {
    case "body": {
      return [
        body("phone_number").isInt(),
        body("name").matches(/^[0-9a-zA-Z]{6,}$/, "i")
      ];
    }
  }
};

///#region Get all Users.
exports.all = (req, res) => {
  const id = req.user.phone_number;
  User.findOne({ identifier: id })
    .then(user => {
      const storeAssistants = user.assistants;
      res.status(200).json({
        success: "true",
        message: "Successfully retrieved all store assistants",
        data: {
          statusCode: 200,
          assistants: storeAssistants,
        },
      });
    })
    .catch(err => {
      res.status(500).send({
        success: "false",
        message: "Internal Error",
        error: {
          statusCode: 500,
          message: "Could not retrive users due to an internal error"
        }
      });
    });
};
//#endregion

//Add new user

exports.new = async (req, res) => {
  const { name,email, password, phone_number } = req.body;


    // Check if Phone exists
    let userExists = await User.findOne({ identifier: req.user.phone_number });
    if (userExists === null) {
        let userExists = await User.findOne({ identifier: req.user.phone_number.toString() });
        if (userExists) {
            // userExists.local.api_token = token;
            userExists.assistants.push(
                {
                    name:name,
                    email: email,
                    password: password,
                     phone_number: phone_number
                }
            )
            await userExists.save()
            .then((user) => {
                return res.status(200).json({ 
                    success: "true",
                    message: "Assistant Added Successfully",
                    data: {
                        statusCode: 200,
                        assistant: userExists.assistants,
                        user: user
                    }
                });
            } )
            .catch((err) => {
                return res.status(500).json({
                    success: "false",
                    message: "Error",
                    data: {
                        statusCode: 500,
                        error: err.message
                    }
                })
            })
        } else {
            return res.status(404).json({
                success: "false",
                message: "User Not Found",
                data: {
                    statusCode: 404,
                    error: "User Dosen't Exist"
                }
            })
        }
    }
    else {
        if (userExists) {
            // userExists.local.api_token = token;
            userExists.assistants.push(
                {
                    name:name,
                    email: email,
                    password: password,
                     phone_number: phone_number
                }
            )
            await userExists.save()
            .then((user) => {
                return res.status(200).json({ 
                    success: "true",
                    message: "Assistant Added Successfully",
                    data: {
                        statusCode: 200,
                        assistant: userExists.assistants,
                        user: user
                    }
                });
            } )
            .catch((err) => {
                return res.status(500).json({
                    success: "false",
                    message: "Error",
                    data: {
                        statusCode: 500,
                        error: err.message
                    }
                })
            })
        } else {
            return res.status(404).json({
                success: "false",
                message: "User Not Found",
                data: {
                    statusCode: 404,
                    error: "User Dosen't Exist"
                }
            })
        }
    }


}


//#region Fnd a single user with a user_id
exports.getById = (req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: "false",
          message: "User not found",
          error: {
            statusCode: 404,
            message: "User not found with id " + req.params.user_id
          }
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: "false",
          message: "User not found",
          error: {
            statusCode: 404,
            message: "User not found with id " + req.params.user_id
          }
        });
      } else {
        return res.status(500).send({
          success: "false",
          message: "Internal Error",
          error: {
            statusCode: 404,
            message: "Error finding user with id " + req.params.user_id
          }
        });
      }
    });
};

exports.update = async (req, res) => {

    const userFields = req.body;
    try {

        let user = await User.findOne({ identifier: '0' + req.user.phone_number.toString() });
        if (user == null) {
            let user = await User.findOne({ identifier: req.user.phone_number.toString() });
            if (!user) return res.status(404).json({
                success: "false",
                message: "User not found",
                error:{
                    statusCode: 404,
                    message: "User with the provided details does not exist"
                }
             });

            // Update Assistant
            //user = await User.findById(req.params.assistant_id);
            // ,
            //     { $set: {assistants: userFields} },
            //     { new: true }
            // Send updated user details
            if (user.assistants.length !== 0) {
                user.assistants.map((assist) => {
                    if (assist._id.equals(req.params.assistant_id)) {
                        assist.name =  req.body.name,
                        assist.email = req.body.email,
                        assist.phone_number = req.body.phone_number
                    }
                })
                user.save()
                .then((userSaved) => {
                    res.status(201).json({
                        success: "true",
                        message: "Assistants details updated successfully",
                        data:{
                            statusCode: 201,
                            data: userSaved,
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: "false",
                        message: "Internal server error",
                        error:{
                            statusCode: 500,
                            message: "Assistant details could not be updated",
                        }
                    });
                })  
            }
            else {
                res.status(500).json({
                    success: "false",
                    message: "You have no assistants yet",
                    error:{
                        statusCode: 500,
                        message: "You have no assistants yet",
                    }
                });
            } 
        }
        else {
            if (!user) return res.status(404).json({
                success: "false",
                message: "User not found",
                error:{
                    statusCode: 404,
                    message: "User with the provided details does not exist"
                }
             });
    
            // Update Assistant
            //user = await User.findById(req.params.assistant_id);
            // ,
            //     { $set: {assistants: userFields} },
            //     { new: true }
            // Send updated user details
            if (user.assistants.length !== 0) {
                user.assistants.map((assist) => {
                    if (assist._id.equals(req.params.assistant_id)) {
                        assist.name =  req.body.name,
                        assist.email = req.body.email,
                        assist.phone_number = req.body.phone_number
                    }
                })
                user.save()
                .then((userSaved) => {
                    res.status(201).json({
                        success: "true",
                        message: "Assistants details updated successfully",
                        data:{
                            statusCode: 201,
                            data: userSaved,
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: "false",
                        message: "Internal server error",
                        error:{
                            statusCode: 500,
                            message: "Assistant details could not be updated",
                        }
                    });
                })  
            }
            else {
                res.status(500).json({
                    success: "false",
                    message: "You can't update assistants yet because you have no one presently",
                    error:{
                        statusCode: 500,
                        message: "You have no assistants yet",
                    }
                });
            } 
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: "false",
            message: "Internal server error",
            error:{
                statusCode: 500,
                message: "Assistant details could not be updated",
            }
        });
    }

};
//#endregion

//#region Delete a user the user_id
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.user_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          success: "false",
          message: "User not found",
          error: {
            statusCode: 404,
            message: "User not found with id " + req.params.user_id
          }
        });
      } else {
        res.status(200).json({
          success: "true",
          message: "User deleted successfully",
          error: {
            statusCode: 200,
            message:
              "User with id " + req.params.user_id + " has been deleted ",
            data: user
          }
        });
      }
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).json({
          success: "false",
          message: "User delete failed",
          error: {
            statusCode: 404,
            message:
              "User with id: " + req.params.user_id + " could not be found "
          }
        });
      }
      return res.status(500).send({
        success: "false",
        message: "User delete failed",
        error: {
          statusCode: 404,
          message:
            "User with id: " +
            req.params.user_id +
            " could not be deleted due to an internal error"
        }
      });
    });
};
//#endregion
