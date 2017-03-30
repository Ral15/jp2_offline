const express = require('express');
const router = express.Router();

const urls = require('./urls');

const userController = require('../controllers/user');


//GET user dashboard
router.get(urls.dashboard, function(req, res) {
	userController.showDashboard(req, res);
});

//POST save user in db
router.post(urls.createUser, function(req, res) {
	userController.createUser(req, res);
});

//POST login user
router.post(urls.login, function(req, res) {
	userController.loginUser(req, res);
});

module.exports = router;