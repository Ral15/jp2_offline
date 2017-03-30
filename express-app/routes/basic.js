const express = require('express');
const router = express.Router();
const urls = require('./urls')


//GET home page.
router.get(urls.home, function(req, res) {
  res.render('login');
});

// In the future, 404, 500 routes should be in this file


module.exports = router;