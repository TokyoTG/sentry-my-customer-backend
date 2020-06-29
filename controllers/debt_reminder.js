const debt = require("../models/debt_reminders")
const Response = require('../util/response_manager')
const HttpStatus = require('../util/http_status')
const mongoose = require('mongoose')
const Transaction = require("../models/transaction")

exports.create = async (req,res)=>{
    // Add new message
    let transaction_id = req.body.transaction_id || req.params.transaction_id;
    
    let { phone_number } = req.user;

    Transaction.findById(transaction_id)
        .then(trans => {
            if(!trans) return Response.failure(res, { error: true, message: 'Transaction could not be found...'}, HttpStatus.NOT_FOUND);

            let { message, status, pay_date } = req.body;

            debt.create({
                phone_number: phone_number,
                ts_ref_id: trans._id,
                message: message,
                status: status,
                expected_pay_date: pay_date
            })
            .then(resp => {
                if(!resp) return Response.failure(res, { error: true, message: 'Debt Reminder could not be found...'}, HttpStatus.NOT_FOUND);
                return Response.success(res, { error: false, message: 'Debt Reminder was created.'});
            })
            .catch(err =>{ 
                return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR);
            })

        })
        .catch(err => {
            return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR);
        })
}

exports.getAll = async (req,res)=>{
    // Find all the messages
    let { phone_number } = req.user;

    debt.find({ phone_number })
        .then(resp => {
            if(!resp) return Response.failure(res, { error: true, message: resp}, HttpStatus.NOT_FOUND);
            return Response.success(res, { error: false, message: resp});
        })
        .catch(err => { return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR); })
}

exports.getById = async (req,res)=>{
    if(!req.params._id) return Response.failure(res, { error: true, message: "The following parameter "}, HttpStatus.NOT_FOUND)
    debt.findById(req.params._id)
        .then(resp => {
            if(!resp) return Response.failure(res, { error: true, message: resp}, HttpStatus.NOT_FOUND)
            return Response.success(res, { error: false, message: resp})
        })
        .catch(err => { return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR) })
}

exports.updateById = async (req,res)=>{
    
}

exports.deleteById = async (req,res)=>{
    
}
