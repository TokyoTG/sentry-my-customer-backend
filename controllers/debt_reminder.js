
const UserModel = require('../models/store_admin')
const Debt = require("../models/debt_reminders");
const Response = require('../util/response_manager')
const HttpStatus = require('../util/http_status')
const mongoose = require('mongoose')
const Transaction = require("../models/transaction");
const { all } = require('../routes/customer');

exports.create = async (req,res)=>{
    // Add new message
    let transaction_id = req.body.transaction_id || req.params.transaction_id;
    let identifier = req.user.phone_number;
    const { store_name, customer_phone_number , message, status, pay_date, amount} = req.body;

    if(!customer_phone_number || !message || !status || !pay_date || !amount){
        res.status(500).json({
            sucess: false,
            message: "Missing fields",
            error: {
              statusCode: 500,
              message: "customer_phone_number, store_name, pay_date, amount, message and status are required"
            }
          })
    }

    try{

        UserModel.findOne({ identifier })
            .then(user => {
                let store = user.stores.find(store => store.store_name == store_name);
                
                let customer = store.customers.find(customer => customer.phone_number === customer_phone_number);
                let transaction = customer.transactions.find(transaction => transaction._id == transaction_id);

                const newDebt = {
                    user_phone_number: identifier,
                    customer_phone_number,
                    amount: amount,
                    ts_ref_id: transaction._id,
                    message: message,
                    status: status,
                    expected_pay_date: new Date(pay_date),
                }
                
                transaction.debts.push(newDebt);


                user.save().then(result => {
                    res.status(200).json({
                        success: true,
                        message: "Debt created successfully",
                        data: {
                            statusCode: 200,
                            debt: newDebt
                        }
                    })
                });

            })
            .catch(err => {
                res.status(404).json({
                    sucess: false,
                    message: "User not found",
                    error: {
                      statusCode: 404,
                      message: "User not found"
                    }
                })
            })
            
    } catch (err){
        res.status(500).json({
            sucess: false,
            message: "Some error occurred while creating transaction",
            error: {
              statusCode: 500,
              message: err.message
            }
        })
    }
        
}

exports.getAll = async (req,res)=>{
    // Find all the Debts
    const identifier = req.user.phone_number;

    UserModel.findOne({ identifier })
        .then(user => {
            let allDebts = [];
            user.stores.forEach(store => {
                store.customers.forEach(customer => {
                    customer.transactions.forEach(transaction => {
                        transaction.debts.forEach(debt => {
                            allDebts.push(debt);
                        })
                    })
                })
            });

            return res.status(200).json({
                success: true,
                message: "All Debts",
                data: {
                    statusCode: 200,
                    debts: allDebts
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                sucess: false,
                message: "Couldn't find user or some server error occurred",
                error: {
                  statusCode: 500,
                  message: err.message
                }
            });
        })
}

exports.getById = async (req,res)=>{
    let identifier = req.user.phone_number;
    if(!req.params.debtId) return Response.failure(res, { error: true, message: "The following parameter "}, HttpStatus.NOT_FOUND)
    
    UserModel.findOne({ identifier })
        .then(user => {
            let allDebts = [];
            user.stores.forEach(store => {
                store.customers.forEach(customer => {
                    customer.transactions.forEach(transaction => {
                        transaction.debts.forEach(debt => {
                            allDebts.push(debt);
                        })
                    })
                })
            });
            
            let debtById = allDebts.find(debt => debt._id == req.params.debtId);

            return res.status(200).json({
                success: true,
                message: "Debt found",
                data: {
                    statusCode: 200,
                    debt: debtById
                }
            }); 
        })
        .catch(err => {
            res.status(500).json({
                sucess: false,
                message: "Couldn't find user or some server error occurred",
                error: {
                  statusCode: 500,
                  message: err.message
                }
            });
        })
}

exports.updateById = async (req, res) => {
    let identifier = req.user.phone_number;
    let { status, message, amount, pay_date } = req.body;

    try {
        UserModel.findOne({ identifier })
        .then(user => {
            let allDebts = [];
            user.stores.forEach(store => {
                store.customers.forEach(customer => {
                    customer.transactions.forEach(transaction => {
                        transaction.debts.forEach(debt => {
                            allDebts.push(debt);
                        })
                    })
                })
            });
            
            let debtById = allDebts.find(debt => debt._id == req.params.debtId);
            let update = {
                amount: amount || debtById.amount,
                message: message || debtById.message,
                status: status || debtById.status,
                pay_date: Date(pay_date) || debtById.expected_pay_date
            }
            debtById = Object.assign(debtById, update);
            user.save().then(result => {
                res.status(200).json({
                    success: true,
                    message: "Debt updated successfully",
                    data: {
                        statusCode: 200,
                        debt: debtById,
                    }
                  })
            })
        })
        .catch(err => {
            res.status(404).json({
                sucess: false,
                message: "Couldn't find user or some server error occurred",
                error: {
                  statusCode: 404,
                  message: err.message
                }
            });
        })
    } catch(err) {
        res.status(500).json({
            sucess: false,
            message: "Some server error occurred",
            error: {
              statusCode: 500,
              message: err.message
            }
        });
    }
     
};

exports.deleteById = async (req, res) => {
    let id = req.params.debtId;
};

