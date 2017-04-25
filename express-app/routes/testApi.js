const express = require('express');
const router = express.Router();
const urls = require('./urls');
const testApiController = require('../controllers/testApi');



// GET to show family form
router.get(urls.api.getEstudios, function(req, res) {
  testApiController.getEstudios(req, res);
});

router.post(urls.api.uploadEstudio, function(req, res) {

  if (req.params.id) {
    testApiController.editEstudio(req, res);
  }
  else testApiController.uploadEstudio(req, res);
});

// router.post(urls.api.uploadEstudio, function(req, res) {
//   console.log('el put');
//   testApiController.uploadEstudio(req, res);
// });

module.exports = router;