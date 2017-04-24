const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const basicRoutes = require('./routes/basic.js');
const userRoutes = require('./routes/user.js');
const estudioRoutes = require('./routes/estudio.js');
const familyRoutes = require('./routes/family.js');
const incomeRoutes = require('./routes/income.js');
const outcomeRoutes = require('./routes/outcome.js');
const memberRoutes = require('./routes/member.js');
const User = require('./models/user.js');
const app = express();
const { SECRET_SESSION, ENV } = require('../config');

//Database connection
const connect = require('camo').connect;
var database;

var uri;
if (ENV == 'testing') uri = 'nedb://testDB';
else uri = 'nedb://db';
console.log('current env: ' + ENV);
connect(uri).then(function(db) {
  database = db;
});


//template engine
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname + '/views/partials'));
// pass to doc
hbs.registerHelper('ifEq', function(value1, value2, opt) {
	if (value1 == value2) {
		return opt.fn(this);
	}
	else {
		opt.inverse(this);
	}
});
hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});
hbs.registerHelper('multiply', function(value1, value2) {
  return value1 * value2;
});
// setup cors
app.use(cors())
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//declare static files
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));
app.use('/template', express.static(path.join(__dirname + '/node_modules/gentelella/')));
app.use('/sweetalert2', express.static(path.join(__dirname + '/node_modules/sweetalert2/')));
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

app.use(function(request, response, next) {
    // response.locals.csrfToken = request.csrfToken();
  if (request.session.user){
    response.locals.user = request.session.user;
  }
  next();
});

//routes
app.use(basicRoutes);
app.use(userRoutes);
app.use(estudioRoutes);
app.use(familyRoutes);
app.use(incomeRoutes);
app.use(memberRoutes);
app.use(outcomeRoutes);

app.listen(3000, function () {
  console.log('Juan Pablo II app listening on port 3000!')
})



module.exports = app;
