const express = require('express');
const router = express.Router();

const urls = require('./urls');
const userController = require('../controllers/user');
const sectionController = require('../controllers/section');


//GET user dashboard
router.get(urls.dashboard, function(req, res) {
	// console.log(req);
	userController.showDashboard(req, res, 'Borrador');
});

// POST login user
router.post(urls.login, function (req, res) {
  userController.loginUser(req, res);
});

// // GET Question from APi
// router.get(urls.getQuestions, function (req, res) {
//   sectionController.getQuestions(req, res);
// });

module.exports = router;
