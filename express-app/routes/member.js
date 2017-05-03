const express = require('express');
const router = express.Router();
const urls = require('./urls');
const membersController = require('../controllers/member');

// POST to create family members
router.post(urls.memberCreate, function(req, res) {
	membersController.addMember(req, res);
});

router.post(urls.memberEdit, function(req, res) {
    membersController.editMember(req,res);
});

router.post(urls.memberDelete, function(req, res) {
  membersController.deleteMember(req,res);
});

router.get(urls.membersView, function(req, res) {
  membersController.showMemberView(req, res);
});

module.exports = router;
