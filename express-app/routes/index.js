const express = require('express'),
      router = express.Router();

const urls = require('./urls')
const userController = require('../controllers/user');

//GET home page.
router.get(urls.home, function(req, res) {
  res.render('estudio', {title: 'Express'});
});

//POST save user in db
router.post(urls.createUser, function(req, res) {
	userController.createUser(req, res);
});

//POST login user
router.post(urls.login, function(req, res) {
	userController.loginUser(req, res);
});


//GET user dashboard
router.get(urls.dashboard, function(req, res) {
	res.render('dashboard');
});

//GET estudio create form
router.get(urls.estudioCreate, function(req, res) {
	res.render('estudio');
});

module.exports = router;