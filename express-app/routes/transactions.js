const express = require('express');
const router = express.Router();
const urls = require('./urls');
const transactionsController = require('../controllers/transaction');



// POST to create income 
router.get(urls.transactionsView, function(req, res) {
	transactionsController.showTransactionView(req,res);
});

router.post(urls.transactionDelete, function(req, res) {
	transactionsController.deleteTransaction(req, res);
});


module.exports = router;
