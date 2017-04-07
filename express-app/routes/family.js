const express = require('express');
const router = express.Router();
const urls = require('./urls');
const familyController = require('../controllers/family');



// POST to create family members
router.post(urls.memberCreate, function(req, res) {
	familyController.editMembers(req,res);
});


module.exports = router;
