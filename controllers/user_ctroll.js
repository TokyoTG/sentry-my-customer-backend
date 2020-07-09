const Response = require('../util/response_manager')
const HttpStatus = require('../util/http_status')
const UserModel = require('../models/user')

module.exports.updateUser = async (req, res, next) => {
    const { _id, first_name, last_name, email, password, phone_number, is_active, user_role } = req.body;

    UserModel.updateOne({ _id: _id }, {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            phone_number: phone_number,
            is_active: is_active,
            user_role: user_role
    })
    .then(resp => {
        if(!resp) return Response.failure(res, { error: true, message: 'User could not be found...'}, HttpStatus.NOT_FOUND);
        return Response.success(res, { error: false, message: 'Record was updated.'});
    })
    .catch(err =>{ 
        if(!err) return Response.failure(res, { error: true, message: 'Something went wrong...'}, HttpStatus.INTERNAL_SERVER_ERROR);
    })

}

    


