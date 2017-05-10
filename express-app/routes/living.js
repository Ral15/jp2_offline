const express = require('express');
const router = express.Router();
const urls = require('./urls');
const livingController = require('../controllers/living');

// GET living page
router.get(urls.living, function (req, res) {
  livingController.showLivingPage(req, res);
});

// POST save image
router.post(urls.image, function (req, res) {
  livingController.saveImage(req, res);
});


module.exports = router;
