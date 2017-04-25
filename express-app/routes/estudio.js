const express = require('express');
const router = express.Router();
const urls = require('./urls');
const estudioController = require('../controllers/estudio');



//GET to show family form
router.get(urls.estudio, function(req, res) {
  estudioController.showFamilyForm(req, res);
});


//POST to create a Estudio
router.post(urls.estudioCreate, function(req, res) {
  let estudioId = req.query.estudioId;
  if (!estudioId) {
    estudioController.createEstudio(req, res);
  }
  else {
    estudioController.editEstudio(req, res);
  }
});


//POST to delete an estudio
router.post(urls.estudioDelete, function(req, res) {
  estudioController.deleteEstudio(req,res);
});

//GET to obtain estudios with status
router.get(urls.getEstudios, function(req, res) {
  estudioController.getEstudios(req, res);
});

router.post(urls.newAnswer, function(req, res){
  estudioController.addAnswer(req,res);
});

router.post(urls.newSelectAnswer, function(req, res){
  estudioController.addSelectAnswer(req,res);
});

router.post(urls.removeAnswer, function(req, res){
  estudioController.removeAnswer(req,res);
});

router.post(urls.uploadEstudio, function(req, res){
  estudioController.uploadEstudio(req,res);
});


module.exports = router;