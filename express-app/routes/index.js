const express = require('express'),
      router = express.Router();

const urls = require('./urls')

//GET home page.
router.get(urls.home, function(req, res) {
  res.render('login', {title: 'Express'});
});


module.exports = router;