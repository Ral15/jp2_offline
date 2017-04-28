const Seccion = require('../models/seccion');
const Respuesta = require('../models/respuesta');
const Subsection = require('./subsection');
const req = require('request');
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
  getQuestions: function (user, request, response) {
    request.session.user = user;
    Seccion.count().then((total) => {
      if (total === 0) {
        req.get(
          // url to get
          urls.apiUrl + urls.api.questions,
          {
            headers: {
              'Authorization': 'Token ' + user.apiToken,
            },
          },
          function (error, httpResponse, body) {
            if (httpResponse.statusCode > 201) {
              response.render('dashboard', { error_message: 'No se obtuvo la información' });
            } else {
              const data = JSON.parse(body);
              data.forEach(function (item) {
                let section = Seccion.create({
                  idApi: item.id,
                  nombre: item.nombre,
                  numero: item.numero,
                });
                item.subsecciones.forEach(function (subsection) {
                  section.subsecciones.push(Subsection.addSubsection(subsection));
                });
                section.save().then(() => {
                  console.log('Seccion guardada');
                }).catch((err) => {
                  console.log(err);
                });
              });
              response.render('dashboard', {user: user, active: 'Borrador'});
            }
          });
      } else {
        response.render('dashboard', {user: user, active: 'Borrador'});
      }
    }).catch((error) => {
      console.log(error);
    });
  },
  /**
  * This controller searches for all the sections and the answers related to an estudio in order
  * to display them.
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  displaySections: function(request, response, step){
    Seccion.findOne({numero: step})
    .then((seccion) => {
      Respuesta.find({
        idSeccion: step,
        idEstudio: request.session.estudioId
      }, {
        sort: 'orden'
      }).then((respuestas) => {
        response.render('section',  {
          section: seccion,
          respuestas: respuestas
        });
      })
    })
    .catch((error) => {
      //no estudio found
      console.log(error);
    });
  }
};
