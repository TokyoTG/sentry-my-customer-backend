require("dotenv").config();
const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');
const express = require('express');
const Customer = require("../models/customer")

const router = express.Router();

const {
    MESSAGEBIRD_KEY,
    MESSAGEBIRD_ORIGINATOR
} = process.env;

router.use(require("body-parser").urlencoded({
    extended: true
}));
const messagebird = require('messagebird')(MESSAGEBIRD_KEY); //4505 test
// const messagebird = require('messagebird')('jXFk6Krvh8Lw24Xn1Kw0XjX4M');//production

module.exports = {
        sendMessage(req, res) {
            try {
                //Find the customer and get phone
                const cust_id = req.params.customer_id
                Customer.findById(cust_id).catch(err => {
                    res.status(404).json({
                        success: false,
                        message: "Customer Not Found",
                        error: {
                            statusCode: 404,
                            description: "Could not found a customer with id: " + cust_id
                        }
                    })
                }).then(customer => {
                    const phone = customer.phone_number
                    //NOTE: both keys can only work with +2348145502505
                    const recipient = phone;
                    const message = req.body.message
                    var params = {
                        'originator': MESSAGEBIRD_ORIGINATOR,
                        'recipients': [
                            recipient
                        ],
                        'body': message
                    };
                    messagebird.messages.create(params, (err, response) => {
                        if (err) {
                            res.status(err.statusCode).json({
                                success: false,
                                message: "Request cannot be processed",
                                error: err
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Message sent successfully",
                                data: response
                            })
                        }
                    })
                })
            } catch (e) {

            }
        }
    }
