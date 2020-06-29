require("dotenv").config();
const Response = require('../util/response_manager'),
            HttpStatus = require('../util/http_status'),
            express = require('express'),
            nodemailer = require('nodemailer'),
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
        const id = req.params.customer_id;
        Customer.findById(id, (err, foundCustomer)=>{
            if(err){
                res.status(404).json({
                    success: false,
                    message: "Customer not found",
                    error: {
                        statusCode: 404,
                        description: "Could not find a customer with the id: " + id
                    }
                });
            }else{
                if(foundCustomer.email  && foundCustomer.email != "Not set" || undefined){
                    const recipient = foundCustomer.email,
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
                                error:{
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
                }else{
                    res.status(400).json({
                        success: false,
                        message: "Bad request",
                        error: {
                            statusCode: 400,
                            description: "Please update customer email address in order to send emails"
                        }
                    })
                }
            }
        })
    }
}
