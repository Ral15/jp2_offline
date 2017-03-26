const Seccion = require('../models/seccion');
const Subsection = require('./subsection');
const req = require('request');
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
  getQuestions: function (request, response) {
    // Call promise that validates internet connection
    isOnline().then(() => {
      req.get(
        // url to get
        urls.apiUrl + urls.api.questions,
        {
          headers: {
            'Authorization': 'Token 0232143aa2ffc2ab6e434bcf9942c15a67d41d6a', // + request.session.apiToken
          },
        },
        function (error, httpResponse, body) {
          if (httpResponse.statusCode > 201) {
            response.render('dashboard', { msg: 'No se obtuvo la información' });
          } else {
            const data = JSON.parse(body);
            data.forEach(function (item) {
              const section = Seccion.create({
                idApi: item.id,
                nombre: item.nombre,
                numero: item.numero,
              });
              item.subsecciones.forEach(function (subsection) {
                section.subsecciones.push(Subsection.addSubsection(subsection));
              });
              section.save()
              .then(() => {
                console.log('Sección guardada');
              }).catch((err) => {
                console.log(err);
              });
            });
            response.render('dashboard', { msg: 'Las preguntas se obtuvieron satisfactoriamente' });
          }
      });
    });
  },
};
