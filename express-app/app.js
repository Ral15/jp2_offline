const express = require('express'),
    app = express(),
    routes = require('./routes/index.js'),
    user = require('./routes/user.js'),
    path = require('path')

var Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(__dirname, 'db/user'), autoload: true });


var hbs = require('hbs');

hbs.registerPartials(path.join(__dirname + '/views/partials'));


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', routes);


// app.use('/user', user);

app.post('/user/login', function (request, response) {
  const data = request.body
  db.findOne({ $and: [{email:  data.email}, {password: data.password}] }, function (err, docs) {
    if (err) console.log(err)
    else {
      response.render('dashboard', {user: docs})
    }
    // console.log(docs)
  });
})

app.post('/user/create', function (request, response) {
  
  const data = request.body
  
  var doc = { 
    firstName: data.first_name,
    lastName: data.last_name, 
    email: data.email,
    password: data.password
  };

  db.insert(doc, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    console.log(newDoc)
  });
})


// app.get('/user/dashboard', function (request, response) {

// })



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



module.exports = app;