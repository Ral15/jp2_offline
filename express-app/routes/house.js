const express = require('express');
const router = express.Router();
const urls = require('./urls');
const houseController = require('../controllers/house');
const path = require('path');
const multer = require('multer');

//define path
let storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, path.join(__dirname, '../public/img/vivienda'))
 },
 filename: function (req, file, cb) {
   if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || 
   	file.mimetype === 'image/png') {
	   return cb(null, req.session.estudioId + '_' + file.originalname);
	}
	req.fileValidationError = 'goes wrong on the mimetype';
 	return cb(new Error('goes wrong on the mimetype'));
 }
});

let upload = multer({ storage: storage });

router.get(urls.houseView, function(req, res){
  houseController.houseView(req,res);
});

router.post(urls.uploadHouse, upload.single('image'), function(req, res){
  houseController.uploadHouse(req,res);
});


module.exports = router;