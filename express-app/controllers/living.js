const Estudio = require('../models/estudio');
const Vivienda = require('../models/vivienda');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');


module.exports = {
  /**
  * This function shows the Living place form, IF the url query is empty
  * then it means that estudio is created from scratch, IF NOT then
  * it means it is a estudio that is going to be updated.
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  showLivingPage: function(request, response) {
    //retrieve estudio id from url
    let estudioId = request.query.estudioId;
    if (estudioId) {
      request.session.id_estudio = estudioId;
      response.locals.estudioId = request.session.id_estudio;
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        request.session.max_step = myEstudio.maxStep;
        response.locals.max_step = request.session.max_step;
        response.render('living');
      })
      .catch((error) => {
        //no estudio found
        console.log(error);
      })
    }
    else {
      console.log(request.session.id_estudio)
      response.render('living');
    }
  },
  /**
  * This function save an image in the Estudio
  *
  *
  * @function
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  saveImage: function (request, response) {

    let estudioId = request.session.id_estudio;

    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '..', '/public/img/estudioImgs');

    form.on('file', function (field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('error', function (err) {
      console.log('An error has ocurred: \n' + err);
    });

    form.on('end', function () {
      response.end('success');
    });

    form.parse(request);
  },
}
