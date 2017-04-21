const User = require('../models/user');
const req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const bcrypt = require('bcryptjs');
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
      // If there is internet connection, check with API
      if (online) this.requestUser(data, request, response);
      else {
        User.findOne({ username:  data.username })
        .then((doc) => {
          if (doc) {
            bcrypt.compare(data.password, doc.password, function (err, res) {
              if (err) {
                console.log(err);
                response.render('login', { error_message: 'Hubo un error en la contraseña' });
              } else if (res) {
                Estudio.find({ tokenCapturista: doc.apiToken, status: 'Borrador' })
                .then((e) => {
                  request.session.user = doc;
                  response.render('dashboard', { user: doc, estudios: e, active: 'Borrador' });
                })
                .catch((error) => {
                  console.log(error);
                  response.render('dashboard', { error_message: 'Estudios no encontrados, presione recargar para volver a intentarlo '});
                });
              } else response.render('login', { error_message: 'Contraseña invalida' });
            });
          } else response.render('login', { error_message: 'Usuario invalido' });
        })
        .catch((err) => {
          console.log(err);
          response.render('login', { error_message: 'No hay internet, el usuario no fue encontrado' });
        });
      }
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
    var self = this;
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
          response.render('login', { error_message: 'Usuario o contraseña invalidos' });
        } else {
          User.findOne({ username:  data.username })
          .then((doc) => {
            if (doc) {
              bcrypt.compare(data.password, doc.password, function (err, res) {
                if (err) {
                  console.log(err);
                  response.render('login', { error_message: 'Hubo un error en la contraseña' });
                }
                else if (res) {
                  Estudio.find({ tokenCapturista: doc.apiToken, status: 'Borrador' })
                  .then((e) => {
                    request.session.user = doc;
                    response.render('dashboard', { user: doc, estudios: e, active: 'Borrador' });
                  })
                  .catch((error) => {
                    console.log(error);
                    response.render('dashboard', { error_message: 'Estudios no encontrados, presione recargar para volver a intentarlo' });
                  });
                } else {
                  editedUser = self.resetPassword(doc, data);
                  SectionController.getQuestions(editedUser, request, response);
                }
              });
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
                response.render('login', { error_message: 'Hubo un error al guardar el usuario' });
              });
            }
          }).catch((err) => {
            console.log(err);
            response.render('login', { error_message: 'Hubo un error al buscar el usuario en la base de datos' });
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
      response.render('dashboard', { estudios: e , active: 'Borrador' });
    })
    .catch((error) => {
      console.log(error);
      response.render('dashboard', { error_message: 'Estudios no encontrados, presione recargar para volver a intentarlo' });
    });
  },

  /**
  * This function reset the password from a user that was
  * actually logged.
  *
  * @function
  * @param {object} user - actual user who will be edited.
  * @param {object} data - user updated
  */
  resetPassword: function (user, data) {
    let hash = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10), null);
    User.findOneAndUpdate({ _id: user._id }, { password: hash }).then((editedUser) => {
      return editedUser;
    }).catch((err) => {
      console.log(err);
      response.render('login', { error_message: 'Hubo un error al resetear la contraseña' });
    });
  },
};
