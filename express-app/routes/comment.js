const express = require('express');
const router = express.Router();
const urls = require('./urls');
const commentController = require('../controllers/comment');


router.post(urls.saveComment, function(req, res) {
  commentController.saveComment(req, res);
});

module.exports = router;
