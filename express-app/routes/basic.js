const express = require('express');
const router = express.Router();
const urls = require('./urls')


//GET home page.
router.get(urls.home, function(req, res) {
  if(req.session.user != null){
    res.redirect(urls.dashboard);
  } else {
    res.render('login');
  }
});

module.exports = router;
