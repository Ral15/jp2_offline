const express = require('express');
const router = express.Router();
const urls = require('./urls');
const incomeController = require('../controllers/income');



// POST to create income 
router.post(urls.incomeCreate, function(req, res) {
	incomeController.createIncome(req,res);
});


router.post(urls.incomeEdit, function(req, res) {
	incomeController.editIncome(req, res);
});

module.exports = router;
