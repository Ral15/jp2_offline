const express = require('express');
const router = express.Router();
const urls = require('./urls');
const familyController = require('../controllers/family');



// POST to create family members
router.post(urls.memberCreate, function(req, res) {
  if (req.query.memberId) {
    familyController.editMember(req,res);
  }
  else {
    familyController.addMember(req, res);
  }
});


module.exports = router;
