const express = require('express'),
      router = express.Router();

const urls = require('./urls')
const userController = require('../controllers/user');
const familyController = require('../controllers/family');
const estudioController = require('../controllers/estudio');

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


//GET user dashboard
router.get(urls.dashboard, function(req, res) {
	userController.showDashboard(req, res);
});


//GET to show address form
router.get(urls.address, function(req, res) {
	estudioController.showAddressForm(req, res);
});

//POST to create family
router.post(urls.familyCreate, function(req, res) {
	familyController.createFamily(req,res);
});

//POST to create an address
router.post(urls.addressCreate, function(req, res) {
	let estudioId = req.query.estudioId;
	if (!estudioId) {
		estudioController.createEstudio(req, res);
	}
	else {
		estudioController.editAddressEstudio(req, res);
	}
});


//POST to delete an estudio
router.post(urls.estudioDelete, function(req, res) {
	estudioController.deleteEstudio(req,res);
});

//POST to edit an address
router.get(urls.address, function(req, res) {
	estudioController.showAddressForm(req, res);
});


module.exports = router;