const express = require('express'),
      router = express.Router();

const urls = require('./urls')

//GET home page.
router.get(urls.home, function(req, res) {
  res.render('index', {title: 'Express'});
});

//GET create user form
router.get('/create', function(req, res) {
	res.render('create', {title: 'Crear Usuario'});
});

//GET login user form
router.get('/login', function(req, res) {
	res.render('login', {title: 'Iniciar Sesión'});
});


module.exports = router;