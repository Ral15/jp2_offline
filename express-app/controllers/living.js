const Estudio = require('../models/estudio');
const Vivienda = require('../models/vivienda');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const urls = require('../routes/urls');
const rp = require('request-promise');


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
        Vivienda.find({
          idEstudio: estudioId
        })
        .then((viviendas) => {
          response.render('living', { viviendas: viviendas });
        })
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
    var self = this;
    var fileName = '';
    var uploadImages = path.join(__dirname, '..', '/public/img/vivienda');
    var form = new formidable.IncomingForm();
    var uploadLivingEstudio = path.join(__dirname, '..', '/public/img/vivienda/', estudioId);

    if (!fs.existsSync(uploadImages)) {
      fs.mkdirSync(uploadImages);
    }

    if (!fs.existsSync(uploadLivingEstudio)) {
      fs.mkdirSync(uploadLivingEstudio);
    }

    form.multiples = true;
    form.uploadDir = path.join(__dirname, '..', '/public/img/vivienda/', estudioId);

    form.on('file', function (field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
      fileName = file.name;
    });

    form.on('error', function (err) {
      console.log('An error has ocurred: \n' + err);
    });

    form.on('end', function () {
      self.saveInDatabase(request, response, fileName);
      response.end('success');
    });

    form.parse(request);
  },
  /**
  * This function save an image in the Estudio
  *
  *
  * @function
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  saveInDatabase: function (request, response, file) {
    let estudioId = request.session.id_estudio;
    var dir = path.join(__dirname, '..', '/public/img/vivienda/', estudioId, file);
    let living = Vivienda.create({
      idEstudio: estudioId,
      name: file,
      url: dir,
    });
    living.save().then(() => {
      console.log('vivienda guardada');
    }).catch((err) => {
      console.log(err);
    });
  },

/**  uploadImagesApi(userApiToken) {
    Vivienda.find({ idEstudio: estudioId })
    let options = {
      method: 'POST',
      uri: urls.apiUrl + urls.api.uploadImages,
      headers: {
        'Authorization': 'Token ' + userApiToken,
      },
      body: data,
      json: true,
    };
    return rp(options);
  }*/
}
