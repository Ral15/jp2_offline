const express = require('express');
const router = express.Router();
const urls = require('./urls');
const schoolController = require('../controllers/school');


router.get(urls.api.schools, function(req, res) {
  schoolController.getSchools(req, res);
});

module.exports = router;
