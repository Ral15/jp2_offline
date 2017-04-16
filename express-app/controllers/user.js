const User = require('../models/user');
const req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const Estudio = require('../models/estudio');
const SectionController = require('./section');

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
  loginUser: function (request, response) {
    // Get data from request
    const data = request.body;
    // Call promise that validates internet connection
    isOnline().then((online) => {
      // look for the user in the local db first
      User.findOne({ username: data.username, password: data.password })
      .then((doc) => {
        if (doc) {
          Estudio.find({ tokenCapturista: doc.apiToken, status: 'Borrador' })
          .then((e) => {
            request.session.user = doc;
            response.render('dashboard', { user: doc, estudios: e, active: 'Borrador' });
          })
          .catch((error) => {
            console.log(error);
            response.render('error', { msg: 'No se pudieron obtener los estudios' });
          });
        }
        // if user is not found AND there is internet connection, check with API
        else if (online) this.requestUser(data, request, response);
        else response.render('login', { msg: 'No hay internet' });
      })
      .catch((err) => {
        console.log(err);
        response.render('error', { msg: 'No se pudo obtener al usuario' });
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
  requestUser: function (data, request, response) {
    req.post(
      // Url to post
      urls.apiUrl + urls.api.login,
      // Data for the post
      {
        json: {
          username: data.username, password: data.password,
        },
      },
      // Callback
      function (error, httpResponse, body) {
        // If response FAILS show error message
        if (httpResponse.statusCode > 201) {
          response.render('login', { msg: 'Usuario o contraseña invalidos' });
        } else {
          // Create new user with data from the form
          const newUser = User.create({
            username: data.username,
            password: data.password,
            apiToken: body.token,
          });
          // Try to save user at db
          newUser.save()
          .then((user) => {
            SectionController.getQuestions(user, request, response);
          })
          .catch((err) => {
            console.log(err);
            response.render('error', { msg: 'No se pudo crear el estudio' });
          });
        }
      });
  },
  /**
   * This function retrieves all estudios that the user has and
   * renders the dashboard page.
   *
   * @event
   * @param {object} request - request object
   * @param {object} response - response object.
   */
  showDashboard: function(request, response) {
    let user = request.session.user;
    Estudio.find({ tokenCapturista: user.apiToken, status: 'Borrador' })
    .then((e) => {
      response.render('dashboard', { user: user, estudios: e, active: 'Borrador' });
    })
    .catch((error) => {
      console.log(error);
      response.render('error', { msg: 'No se pudieron obtener los estudios' });
    });
  },
};
