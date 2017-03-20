const User  = require('../models/seccion');
var req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');

module.exports = {
  /**
   * This function obtain the cuestions from API
   * (only if there is internet connection).
   * IF request OK the questions will be saved.
   * IF NOT error message will be shown.
   *
   *
   *
   * @event
   * @param {object} request - request object
   * @param {object} response - response object.
   */
  getQuestions: function(request, response) {
    console.log("Hola");
    /*//call promise that validates internet connection
    isOnline().then((online) => {
      req.get(
        // url to get
        urls.apiUrl + urls.api.login,
        function (error, httpResponse, body) {
          if (httpResponse.statusCode > 201)
            console.log("No se pudo");
            //response.render('dashboard', {msg : 'No se obtuvo la información'})
          else {
            console.log("Si se pudo");
          }
        }
      )
    });*/
  }
}
