const express = require('express');
const router = express.Router();
const urls = require('./urls');
const incomeController = require('../controllers/income');



router.get(urls.incomeView, function(req, res) {
	incomeController.showIncomeView(req, res);
})

// POST to create income 
router.post(urls.incomeCreate, function(req, res) {
	incomeController.createIncome(req,res);
});


module.exports = router;
