const express = require('express');
const router = express.Router();
const urls = require('./urls');
const testApiController = require('../controllers/testApi');



// GET to show family form
router.get(urls.api.estudios, function(req, res) {
  // testApiController.getEstudios(req, res);
  console.log(req);
  console.log(req.method);
  console.log('el tgegt');
});

router.post(urls.api.estudios, function(req, res) {

  // if (req.params.id) {
  //   testApiController.editEstudio(req, res);
  // }
  // else 
  testApiController.uploadEstudio(req, res);
  // console.log('el posttosos');
});


module.exports = router;