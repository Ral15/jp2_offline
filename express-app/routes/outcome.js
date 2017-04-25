const express = require('express');
const router = express.Router();
const urls = require('./urls');
const outcomeController = require('../controllers/outcome');




// POST to create outcome 
router.post(urls.outcomeCreate, function(req, res) {
	outcomeController.createOutcome(req,res);
});
//POST to edit outcome
router.post(urls.outcomeEdit, function(req, res) {
	outcomeController.editOutcome(req,res);
});

module.exports = router;
