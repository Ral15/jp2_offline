const express = require('express');
const router = express.Router();
const urls = require('./urls')


//GET home page.
router.get(urls.home, function(req, res) {
  if(req.session.user != null){
    req.session.estudioId = null;
    req.session.max_step = null;
    req.session.familyId = null;
    req.session.estudioAPIId = null;
    res.redirect(urls.dashboard);
  } else {
    res.render('login');
  }
});

// In the future, 404, 500 routes should be in this file


module.exports = router;