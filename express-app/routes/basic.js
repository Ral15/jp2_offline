const express = require('express');
const router = express.Router();
const urls = require('./urls')


//GET home page.
router.get(urls.home, function(req, res) {
  res.render('login');
});

//GET error page.
router.get(urls.error, function(req, res) {
  res.render('error');
});


module.exports = router;
