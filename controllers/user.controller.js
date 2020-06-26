const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const joiValidator = require('../util/joi_validator');

///#region Get all Users.
exports.all = (req, res) => {
    User.find({})
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the users."
        });
    });
};
//#endregion

//Add new user

exports.new = async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    // Request that is sent
    const reqBody = {
        first_name, 
        last_name, 
        email, 
        password, 
        phone_number
    }

    // Validate Request body sent
    const { error, value } = await joiValidator.userRegistrationValidator.validate(reqBody);

    // Check Validation Error
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
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


    const newUser = new User({
        phone_number: value.phone_number,
        first_name: value.first_name,
        last_name: value.last_name,
        email: value.email,
        password: value.password,
        token: token
    })

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    // Check if Phone exists
    const userExists = await User.findOne({ phone_number: newUser.phone_number, email: newUser.email });

    if (userExists) {
        return res.status(400).json({ message: 'Store owner already exists' });
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
                res.json({ token, data: newUser });
            }
        );
    }

    // User.create(newUser, (err, user)=>{
    //     if(err){
    //         res.status(503).json({
    //             status: "fail",
    //             message: "Could not add user due to an internal error"
    //         })
    //     }else{
    //         // res.status(201).json({
    //         //     status: "success",
    //         //     data: user
    //         // })

    //         const payload = {
    //             newUser: {
    //                 id: newUser.id
    //             }
    //         }

    //         jwt.sign(
    //             payload,
    //             process.env.JWT_KEY,
    //             {
    //                 expiresIn: 360000
    //             },
    //             (err, token, data) => {
    //                 if (err) throw err;
    //                 res.json({ token, data: newUser });
    //             }
    //         );

    //     }
    // })
}

//#region Fnd a single user with a user_id
exports.getById = (req, res) => {
    User.findById(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.user_id
        });
    });
};
//#endregion

//#region Update a user the user_id 
// exports.update = (req, res) => {
//     // Validate Request
//     if(!req.body.content) {
//         return res.status(400).send({
//             message: "Did not receive any update values"
//         });
//     }
// else{
//     // Find transaction and update it with the request body
//     User.findByIdAndUpdate(req.params.user_id, req.body.content, {new: true})
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.user_id
//             });
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.user_id
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating user with id " + req.params.user_id
//         });
//         });
// }};
//#endregion


// @route       PUT user/update/:user_id
// @desc        User Updates his user details
// @access      Public (no auth)
// @author      buka4rill
exports.update = async (req, res) => {
    // Pull out data from body
    const { first_name, last_name, phone_number } = req.body;

    // Build data based on fields to be submited
    const userFields = {};

    if (first_name) userFields.first_name = first_name;
    if (last_name) userFields.last_name = last_name;
    if (phone_number) userFields.phone_number = phone_number;

    try {
        let user = await User.findById(req.params.user_id);

        if (!user) return res.status(404).json({ message: 'User not found!' });

        // Update User
        user = await User.findByIdAndUpdate(req.params.user_id,
            { $set: userFields },
            { new: true });

        // Send updated user details   
        res.json(user); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
//#endregion

//#region Delete a user the user_id
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.user_id
        });
    });
};
//#endregion
