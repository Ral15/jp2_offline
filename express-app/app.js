const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const basicRoutes = require('./routes/basic.js');
const userRoutes = require('./routes/user.js');
const estudioRoutes = require('./routes/estudio.js');
const familyRoutes = require('./routes/family.js');
const User = require('./models/user.js');
const app = express();
const { SECRET_SESSION, ENV } = require('../config');

//Database connection
const connect = require('camo').connect;
var database;

var uri;
if (ENV == 'testing') uri = 'nedb://testDB';
else uri = 'nedb://db';
console.log(ENV);
connect(uri).then(function(db) {
  database = db;
});


//template engine
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname + '/views/partials'));
// pass to doc
hbs.registerHelper('ifEq', function(v1, v2, opt) {
	if (v1 == v2) {
		return opt.fn(this);
	}
	else {
		opt.inverse(this);
	}
});
// setup cors
app.use(cors())
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//declare static files
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

//parser for requests
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));

//routes
app.use(basicRoutes);
app.use(userRoutes);
app.use(estudioRoutes);
app.use(familyRoutes);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



module.exports = app;