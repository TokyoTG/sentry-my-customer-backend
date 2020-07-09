const express = require("express");
const router = express.Router();
const transactions = require("../controllers/transaction.controller.js");
const auth = require("../auth/auth");

// Create a new Transaction
router.post("/transaction/new", auth, transactions.create);

// Retrieve all Transactions
router.get("/transaction", auth, transactions.findAll);

// Retrieve a single Transaction with transaction_id
router.get("/transaction/:transaction_id", auth, transactions.findOne);

// Update a Transaction with transaction_id
router.put("/transaction/update/:transaction_id", auth, transactions.update);

// Delete a Transaction with transaction_id
router.delete("/transaction/delete/:transaction_id", auth, transactions.delete);

module.exports = router;
