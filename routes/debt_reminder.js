const express = require('express');
const router = express.Router();
const debt = require("./../controllers/debt_reminder.js");
const auth = require("../auth/auth");

router.post('/debt/new', auth, debt.create)
router.post('/debt/new/:transaction_id', auth, debt.create)
router.get('/debt/all', auth, debt.getAll)
router.put('/debt/update/:customerId', auth, debt.updateById)
router.delete('/debt/delete/:customerId', auth, debt.deleteById)
router.get('/debt/:customerId', auth, debt.getById)

module.exports = router