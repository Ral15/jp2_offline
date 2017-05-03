const express = require('express');
const router = express.Router();
const urls = require('./urls');
const jobController = require('../controllers/job');


router.get(urls.api.jobs, function(req, res) {
  jobController.getJobs(req, res);
});

module.exports = router;
