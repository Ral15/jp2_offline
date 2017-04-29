const express = require('express');
const router = express.Router();
const urls = require('./urls');
const testApiController = require('../controllers/testApi');



// GET to show family form
router.get(urls.api.estudios, function(req, res) {
  testApiController.getEstudios(req, res);
});

router.post(urls.api.estudios, function(req, res) {
  testApiController.uploadEstudio(req, res);
});

module.exports = router;