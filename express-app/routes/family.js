const express = require('express');
const router = express.Router();
const urls = require('./urls');
const familyController = require('../controllers/family');


router.get(urls.familyView, function(req, res) {
	familyController.showFamilyView(req, res);
});

module.exports = router;
