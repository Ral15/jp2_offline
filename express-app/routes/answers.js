const express = require('express');
const router = express.Router();
const urls = require('./urls');
const answerController = require('../controllers/answers');


//GET to obtain estudios with status
router.post(urls.newAnswer, function(req, res){
  answerController.addAnswer(req,res);
});

router.post(urls.newSelectAnswer, function(req, res){
  answerController.addSelectAnswer(req,res);
});

router.post(urls.removeAnswer, function(req, res){
  answerController.removeAnswer(req,res);
});


module.exports = router;