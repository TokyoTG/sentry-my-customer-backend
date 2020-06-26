const Joi = require('@hapi/joi');

module.exports.userRegistrationValidator =  Joi.object({
    phone_number: Joi.string().required(),
    first_name: Joi.string().min(3).max(50).required(),
    last_name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
});
module.exports.userLoginValidator =  Joi.object({
    phone_number: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
});


module.exports.customerValidator =  Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone_number: Joi.string().required(),
});