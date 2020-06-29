
    const express = require('express');
    const router = express.Router();
    const users = require('../controllers/user.controller.js');
    const bodyValidator = require('../util/body_validator')
    const auth = require("../auth/auth");

    router.use("/user", auth)
    //Add new user
    router.post("/user/new", auth, users.validate('body'), bodyValidator, users.new);
   // Retrieve all Users
   router.get('/user/all', auth, users.all);

    // Retrieve a single User with user_id
    router.get('/user/:user_id', auth, users.getById);

   // Update User Info with user_id
   router.put('/user/update/:user_id', auth, users.validate('body'), bodyValidator, users.update);

    // Delete a User with user_id
    router.delete('/user/delete/:user_id', auth, users.delete);

    module.exports = router;
