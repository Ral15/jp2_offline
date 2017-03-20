const User  = require('../models/user');
var req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const Estudio = require('../models/estudio');

module.exports = {
  /**
   * This function checks if user exists in database, if there is
   * no record of the user, it will check with the API (only if there is internet
   * connection).
   * IF request OK dashboard view will be rendered.
   * IF NOT error message will be shown.
   *
   *
   * @event
   * @param {object} request - request object
   * @param {object} response - response object.
   */
  loginUser: function(request, response) {
    //get data from request
    const data = request.body
    //call promise that validates internet connection
    isOnline().then((online) => {
      //look for the user in the local db first
      User.findOne({ username:  data.username, password: data.password})
      .then((doc) => {
        if (doc) {
          Estudio.find({ tokenCapturista: doc.apiToken })
          .then((e) => {
            request.session.apiToken = doc.apiToken;
            response.render('dashboard', {user: doc, estudios: e});
          })
          .catch((error) => {
            console.log(error);
          })
        }
        //if user is not found AND there is internet connection, check with API
        else if(online) this.requestUser(data, request, response)
        else response.render('login', { msg: "No hay internet" })
      })
      .catch((err) => {
        console.log(err)
      });
    });
  },
  /**
   * This function makes a POST to the API in order to validate if there is a user
   * registered with the credentials provided.
   * IF there is a user found it will be stored in the local db for further requests.
   * IF NOT, show error message at login view.
   *
   *
   * @event
   * @param {object} data - data from form
   * @param {object} request - request object
   * @param {object} response - response object.
   */
  requestUser: function(data, request, response) {
    req.post(
      //url to post
      urls.apiUrl + urls.api.login,
      //data for the post
      {
        json: {
          username: data.username, password: data.password
        }
      },
      //callback
      function(error, httpResponse, body) {
        //if response FAILS show error message
        if (httpResponse.statusCode > 201)
          response.render('login', {msg: 'Usuario o contraseña invalidos'})
        else {
          //create new user with data from the form
          let new_user = User.create({
            username: data.username,
            password: data.password,
            apiToken: body.token
          });
          //try to save user at db
          new_user.save()
          .then((user) => {
            console.log(user);
            response.render('dashboard', {user: user})
          })
          .catch((err) => {
            console.log(err)
          });
        }
      }
    );
  },
}
