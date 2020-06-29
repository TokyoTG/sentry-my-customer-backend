const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');
const express = require('express');

const router = express.Router();

router.use(require("body-parser").urlencoded({extended: true}));
const messagebird = require('messagebird')('S2LorOevmKnSHrcS9KBXnVXyq'); //4505 test
// const messagebird = require('messagebird')('jXFk6Krvh8Lw24Xn1Kw0XjX4M');//production

module.exports = {
    //NOTE: both keys can only work with +2348145502505
    initialverification(req, res) {
        var params = {
            originator: "MyCustomer",
            template: "Your MyCustomer verification code is: %token"
        };
        messagebird.verify.create(req.body.phone, params, function (err, response) {
            if (err) {
                res.status(401).json({
                    status: "Fail",
                    message: err
                })
            }else{
            //Now we render a page to enter token
            //There should be a hidden input which will contain the id of the process
            res.status(200).json({
                status: "success",
                response: response
            })
        }
        });
    },
     verifyPhone(req, res) {
         try {
             const id = req.body.id
             const token = req.body.token
             messagebird.verify.verify(id, token, (err, response) => {
                 if (err) {
                     res.status(err.statusCode).json({
                         success: "false",
                         message: "Phone number could not be verified",
                         error: err
                     });
                 } else {
                     res.status(200).json({
                         success: "true",
                         message: response
                     })
                 }
             })
         } catch (e) {

         }
     }
};
