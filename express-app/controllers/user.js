const User = require('../models/user');
const req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const bcrypt = require('bcryptjs');
const Estudio = require('../models/estudio');
const SectionController = require('./section');
// const testApiController = require('./testApi');
const schoolController = require('./school');
const jobController = require('./job');

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
              if (err) console.log(err);
              else if (res) {
                request.session.user = doc;
                return this.showDashboard(request, response, 'Borrador');
              } else response.render('login', { error_message: 'Contraseña invalida' });
            });
          } else response.render('login', { error_message: 'Usuario invalido' });
        })
        .catch((err) => {
          console.log(err);
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
                if (err) console.log(err);
                else if (res) {
                  Estudio.find({ tokenCapturista: doc.apiToken, status: 'Borrador' })
                  .then((estudios) => {
                    request.session.user = doc;
                    response.locals.estudios = estudios
                    SectionController.getQuestions(doc, request, response);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                } else {
                  editedUser = self.resetPassword(doc, data);
                  console.log(editedUser.apiToken);
                  SectionController.getQuestions(editedUser, request, response);
                }
              });
            } else {
              let myUser;
              // Create new user with data from the form
              const newUser = User.create({
                username: data.username,
                password: data.password,
                apiToken: body.token,
              });
              // Try to save user at db
              newUser.save()
              .then((user) => {
                myUser = user;
                return schoolController.getSchools(myUser.apiToken);
              })
              .then((s) => {
                return jobController.getJobs(myUser.apiToken);
              })
              .then((j) => {
                return SectionController.getQuestions(myUser, request, response);
              })
              .catch((err) => {
                console.log(err);
              });
            }
          }).catch((err) => {
            console.log(err);
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
  showDashboard: function(request, response, active) {
    let user = request.session.user;
    console.log(user);
    request.session.estudioId = null;
    request.session.familyId = null;
    request.session.estudioAPIId = null;
    return Estudio.find({ tokenCapturista: user.apiToken, status: active })
    .then((e) => {
      // console.log(e);
      return response.render('dashboard', { estudios: e , active: active });
    })
    .catch((error) => {
      console.log(error);
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
    });
  },
};
