const express = require('express'),
      router = express.Router();

const urls = require('./urls')
const userController = require('../controllers/user');
const sectionController = require('../controllers/section');


//GET home page.
router.get(urls.home, function(req, res) {
  res.render('login', {title: 'Express'});
});

//POST save user in db
router.post(urls.createUser, function(req, res) {
	userController.createUser(req, res);
});

//POST login user
router.post(urls.login, function(req, res) {
	userController.loginUser(req, res);
});

//GET Question from APi
router.get(urls.getQuestions, function (req, res) {
  sectionController.getQuestions(req, res);
});

module.exports = router;
