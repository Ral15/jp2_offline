const express = require('express'),
      router = express.Router();


//POST save user in db
router.post('/create', function(req, res) {
	// res.render('create', {title: 'Crear Usuario'});
	
});

//POST login user
router.post('/login', function(req, res) {
	res.render('login', {title: 'Iniciar Sesión'});
});


module.exports = router;