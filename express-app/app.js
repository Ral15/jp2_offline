const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const basicRoutes = require('./routes/basic.js');
const userRoutes = require('./routes/user.js');
const estudioRoutes = require('./routes/estudio.js');
const familyRoutes = require('./routes/family.js');
const sectionRoutes = require('./routes/section.js');
const answerRoutes = require('./routes/answers.js');
const incomeRoutes = require('./routes/income.js');
const outcomeRoutes = require('./routes/outcome.js');
const memberRoutes = require('./routes/member.js');
const commentRoutes = require('./routes/comment.js');
const transactionsRoutes = require('./routes/transactions.js');
// const apiRoutes = require('./routes/testApi.js');
const User = require('./models/user.js');
const app = express();
const { SECRET_SESSION, ENV } = require('../config');
const hbs = require('./hbs_conf');

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
  if (request.session.user){
    response.locals.user = request.session.user;
  }
  if (request.session.estudioId){
    response.locals.estudioId = request.session.estudioId;
    response.locals.max_step = request.session.max_step
  } else {
    response.locals.estudioId = null;
    response.locals.max_step = null;
  }
  next();
});

//routes
app.use(basicRoutes);
app.use(userRoutes);
app.use(estudioRoutes);
app.use(familyRoutes);
app.use(answerRoutes);
app.use(sectionRoutes);
app.use(incomeRoutes);
app.use(memberRoutes);
app.use(outcomeRoutes);
app.use(transactionsRoutes);
app.use(commentRoutes);

app.listen(3000, function () {
  console.log('Juan Pablo II app listening on port 3000!')
})



module.exports = app;
