const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const familyController = require('./family');


module.exports = {
  /**
  * This function shows the family form, IF the url query is empty
  * then it means that the familia and estudio is created from scratch, IF NOT then
  * it means it is a estudio that is going to be updated.
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  showFamilyForm: function(request, response) {
    //retrieve estudio id from url
    let estudioId = request.query.estudioId;
    if (estudioId) {
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        response.render('family',  {
          estudioId: myEstudio._id,
          family: myEstudio.familia
        });
      })
      .catch((error) => {
        //no estudio found
        console.log(error);
        sweetAlert(
          'Mensaje de error',
          'No se encontró a la familia',
          'error'
        ).then(() => {
          location.reload();
        });
      });
    } else {
      response.render('family');
    }
  },
  /**
  * This function creates a Estudio with te apiToken of the capturista,
  * and with a family,
  * then it shows the form to fill the members information.
  *
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  createEstudio: function(request, response) {
    //retrieve token from params
    const token = request.session.user.apiToken;
    //get data from request
    const data = request.body;
    //create familia
    let newFamily = familyController.createFamily(data);
    //create estudio
    let estudio = Estudio.create({
      tokenCapturista: token,
      familia: newFamily
    });
    //save estudio
    estudio.save()
    .then((newEstudio) => {
      console.log(newEstudio);
      response.render('members', {
        userToken: token,
        estudioId: newEstudio._id,
        family: newFamily
      });
    })
    .catch((error) => {
      //estudio could not be created
      console.log(error);
      sweetAlert(
        'Mensaje de error',
        'No se pudo crear el estudio',
        'error'
      ).then(() => {
        location.reload();
      });
    });
  },
  /**
  * This function edits the address of a Estudio previously created
  *
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  editEstudio: function(request, response) {
    //get estudio ID from url
    const estudioId = request.query.estudioId;
    //get user token from session
    const token = request.session.user.apiToken;
    const data = request.body;
    //get object with the new values for a family
    let editedFamily = familyController.editFamily(data);
    Estudio.findOneAndUpdate({ _id: estudioId },
      {
        familia: editedFamily
      }
    )
    .then((editedEstudio) => {
      response.render('members', {
        userToken: token,
        estudioId: editedEstudio._id,
        family: editedFamily
      });
    })
    .catch((error) => {
      //estudio not edited
      console.log(error);
      sweetAlert(
        'Mensaje de error',
        'El estudio no se pudo editar',
        'error'
      ).then(() => {
        location.reload();
      });
    });
  },
  /**
  * This function changes the status of a Estudio to 'Eliminado'
  * using the id of the estudio
  *
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  deleteEstudio: function(request, response) {
    //get id of estudio
    let estudioId = request.params.id;
    //find estudio
    Estudio.findOneAndUpdate({
      _id: estudioId
    },
    {
      status: 'Eliminado'
    })
    .then((myEstudio) => {
        return response.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      sweetAlert(
        'Mensaje de error',
        'El estudio no se pudo borrar',
        'error'
      ).then(() => {
        location.reload();
        return response.sendStatus(500);
      });
    });
  },
  /**
  * This function returns the Estudios with the status desired
  *
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  getEstudios: function(request, response) {
    let myStatus = request.query.status;
    let user = request.session.user;
    Estudio.find({
      tokenCapturista: user.apiToken,
      status: myStatus
    })
    .then((e) => {
      response.render('dashboard', {
        user: user,
        estudios: e,
        active: myStatus
      });
    })
    .catch((err) => {
      console.log(e);
      sweetAlert(
        'Mensaje de error',
        'No se pudo obtener los estudios',
        'error'
      ).then(() => {
        location.reload();
      });
    })
  }
 }
