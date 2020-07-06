require("dotenv").config();
const Response = require('../util/response_manager'),
            HttpStatus = require('../util/http_status'),
            express = require('express'),
            nodemailer = require('nodemailer'),
            userModel = require("../models/store_admin"),
            Customer = require("../models/customer");


const router = express.Router();
const { MAIL_USERNAME, MAIL_PASSWORD, MAIL_SERVICE } = process.env;

router.use(require("body-parser").urlencoded({extended: true}));

module.exports = {
    sendMail(req, res){
        const transporter = nodemailer.createTransport({
            service: MAIL_SERVICE,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD
            }
        });

        //Find a customer and get the email
        const identifier = req.user.phone_number;
        const customer_id = req.params.customer_id;
        const store_id = req.body.store_id; // the store where the customer is located
        userModel.findOne({
                    identifier
                }, (err, foundUser) => {
            if (err || foundUser == null || foundUser == undefined) {
                res.status(404).json({
                    success: false,
                    message: "Customer not found",
                    error: {
                        statusCode: 404,
                        description: "Could not find a store admin with the identifier: " + identifier
                    }
                });
            }else{
                const stores = foundUser.stores;
                for(var i = 0; i < stores.length; i++){
                    if(stores[i]._id == store_id){
                        customers = stores[i].customers
                        for(var i = 0; i < customers.length; i++){
                            if (customers[i]._id == customer_id){
                                email = customers[i].email
                                if (email && email != "Not set" || undefined) {
                                    const recipient = email,
                                        subject = req.body.subject,
                                        text = req.body.text;

                                    const params = {
                                        from: MAIL_USERNAME,
                                        to: recipient,
                                        subject: subject,
                                        text: text
                                    };

                                    transporter.sendMail(params, function (error, info) {
                                        if (error) {
                                            res.status(401).json({
                                                success: false,
                                                message: "Bad request",
                                                error: {
                                                    statusCode: 401,
                                                    description: error
                                                }
                                            })
                                        } else {
                                            res.status(200).json({
                                                success: true,
                                                message: "Email sent successfully",
                                                data: {
                                                    statusCode: 200,
                                                    description: info
                                                }
                                            })
                                        }
                                    });
                                } else {
                                    return res.status(400).json({
                                        success: false,
                                        message: "Email Not set",
                                        error: {
                                            statusCode: 400,
                                            description: "Please update customer email address in order to send emails"
                                        }
                                    })
                                }
                            }else{
                                return res.send({
                                    status: "fail",
                                    message: "No customer with id " + customer_id + " in store " + stores[i].store_name
                                })
                            }
                        }
                    }else{
                        return res.send({
                            status: "fail",
                            message: "store doesn't exists"
                        })
                    }
                }
            }
        })
    }
}
