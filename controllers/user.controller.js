const User = require('../models/store_admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'body': {
            return [
                body('phone_number').isInt(),
                body('password').matches(/^[0-9a-zA-Z]{6,}$/, "i"),
            ]
        }
    }
}

///#region Get all Users.
exports.all = (req, res) => {
    const id = req.params.current_user
    User.findById(id)
    .then(user => {
        const storeAssistants = user.assistants;
        res.status(200).json({
            success: "true",
            message: "Successfully retrieved all store assistants",
            data:{
                statusCode: 200,
                assistants: storeAssistants
            }
        });
    }).catch(err => {
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
    const { first_name, last_name, email, password, phone_number } = req.body;

    //  Create a Token that will be passed as the "api_token"
    const token = await jwt.sign({
        phone_number: phone_number,
        password: password
    }, process.env.JWT_KEY, {
        expiresIn: "1d",
    });


    const newUser = new User({
        phone_number: phone_number,
        token: token    
    })

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    // Check if Phone exists
    const userExists = await User.findOne({ phone_number: newUser.phone_number });

    if (userExists) {
        return res.status(409).json({ 
            success: "false",
            message: "User already exists",
            data: {
                statusCode: 409,
                conflict: userExists
            }
        });
    } else {
        await newUser.save();

        const payload = {
            newUser: {
                id: newUser.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_KEY,
            {
                expiresIn: 360000
            },
            (err, token, data) => {
                if (err) throw err;
                res.status(201).json({ 
                    success: "true",
                    message: "User created successfully",
                    data: {
                        token,
                        newUser
                    }
                });
            }
        );
    }
}

//#region Fnd a single user with a user_id
exports.getById = (req, res) => {
    User.findById(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                success: "false",
                message: "User not found" ,
                error:{
                    statusCode: 404,
                    message: "User not found with id " + req.params.user_id
                }
            });            
        }else{
            res.send(user);
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                success: "false",
                    message: "User not found",
                    error: {
                        statusCode: 404,
                        message: "User not found with id " + req.params.user_id
                    }
            });                
        }else{
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
    // Build data based on fields to be submited
    const userFields = req.body;

    try {
        let user = await User.findById(req.params.user_id);

        if (!user) return res.status(404).json({
            success: "false",
            message: "User not found",
            error:{
                statusCode: 404,
                message: "User with the provided details does not exist"
            }
         });

        // Update User
        user = await User.findByIdAndUpdate(req.params.user_id,
            { $set: userFields },
            { new: true });

        // Send updated user details   
        res.status(201).json({
            success: "true",
            message: "User details updated successfully",
            data:{
                statusCode: 201,
                data: user
            }
        }); 
    } catch (err) {
        res.status(500).json({
            success: "false",
            message: "Internal server error",
            error:{
                statusCode: 500,
                message: "User details could not be updated"
            }
        });
    }
};
//#endregion

//#region Delete a user the user_id
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: "false",
                    message: "User not found",
                    error: {
                        statusCode: 404,
                        message: "User not found with id " + req.params.user_id
                    }
            });
        }else{
        res.status(200).json({
            success: "true",
                message: "User deleted successfully",
                error: {
                    statusCode: 200,
                    message: "User with id " + req.params.user_id +" has been deleted ",
                    data: user
                }
        }); 
    }
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                success: "false",
                    message: "User delete failed",
                    error: {
                        statusCode: 404,
                        message: "User with id: " + req.params.user_id + " could not be found "
                    }
            });                
        }
        return res.status(500).send({
            success: "false",
                message: "User delete failed",
                error: {
                    statusCode: 404,
                    message: "User with id: " + req.params.user_id + " could not be deleted due to an internal error"
                }
        });
    });
};
//#endregion
