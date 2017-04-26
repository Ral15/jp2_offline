const express = require('express');
const router = express.Router();
const urls = require('./urls');
const SectionController = require('../controllers/section');



// GET to create section members
router.get(urls.sectionStart, function(req, res) {
  res.redirect(urls.sections.replace(':step', '1'));
});


// POST to create section members
router.get(urls.sections, function(req, res) {
  let step = Number(req.params.step);
	SectionController.displaySections(req,res,step);
});


module.exports = router;
