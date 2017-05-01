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

//GET to update estudios from server
router.get(urls.updateEstudios, function(req, res) {
  estudioController.updateEstudios(req, res);
});


router.get(urls.showUploadView, function(req, res) {
  estudioController.showUploadView(req, res);
});

// router.post(urls.)



//API ROUTES
// GET to show family form
router.get(urls.api.estudios, function(req, res) {
  estudioController.getEstudios(req, res);
});

router.post(urls.api.estudios, function(req, res) {
  estudioController.uploadEstudio(req, res);
});


module.exports = router;