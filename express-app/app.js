const express = require('express'),
	  app = express(),
	  routes = require('./routes/index.js'),
	  path = require('path')

var Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(__dirname, 'db'), autoload: true });




//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', routes);

app.post('/user', function (request, response) {
	console.log(request.body)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



module.exports = app;