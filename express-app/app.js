const express = require('express');
const app = express();
const mainRoutes = require('./routes/index.js');
const path = require('path');
const User = require('./models/user.js');
const cors = require('cors');
const session = require('express-session');

//Database connection
const connect = require('camo').connect;
var database;

const uri = 'nedb://db';
connect(uri).then(function(db) {
  database = db;
});



//template engine
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname + '/views/partials'));
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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//routes
app.use('/', mainRoutes);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



module.exports = app;