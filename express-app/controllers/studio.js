const Estudio  = require('../models/estudio');
const Section = require('./Section');
var req = require('request');
const isOnline = require('is-online');
const urls = require('../routes/urls');

module.exports = {
  /**
   * This function obtain the questions from API
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
    //call promise that validates internet connection
    isOnline().then((online) => {
      req.get(
        // url to get
        urls.apiUrl + urls.api.questions,
        {
          headers : {
            'Authorization' : 'Token 0232143aa2ffc2ab6e434bcf9942c15a67d41d6a'
          }
        },
        function (error, httpResponse, body) {
          if (httpResponse.statusCode > 201)
            response.render('dashboard', {msg : 'No se obtuvo la información'});
          else {
            data = JSON.parse(body);
            let studio = Estudio.create();
            count = 0;
            data.forEach(function (item) {
              studio.secciones.push(Section.addSection(item));
            });
            studio.save()
            .then((studio) => {
              response.render('dashboard', {msg : 'Las preguntas se obtuvieron satisfactoriamente'});
            }).catch((err) =>{
              console.log(err);
            });
          }
        }
      );
    });
  },
}
