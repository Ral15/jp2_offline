const express = require('express');
const router = express.Router();
const urls = require('./urls');
const outcomeController = require('../controllers/income');



// router.get(urls.incomeView, function(req, res) {
// 	outcomeController.showIncomeView(req, res);
// })

// POST to create income 
router.post(urls.outcomeCreate, function(req, res) {
	outcomeController.createOutcome(req,res);
});


module.exports = router;
