const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Miembro = require('../models/miembro');
const familyController = require('./family');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

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
      request.session.estudioId = estudioId;
      response.locals.estudioId = request.session.estudioId;
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        request.session.max_step = myEstudio.maxStep;
        response.locals.max_step = request.session.max_step;
        response.render('family',  {
          family: myEstudio.familia
        });
      })
      .catch((error) => {
        //no estudio found
        console.log(error);
      })
    }
    else {
      response.render('family');
    }
  },
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
    let estudioId = '';
    let familyId = '';
    //save familia
    newFamily.save()
    .then((newFamily) => {
      //create estudio
      let estudio = Estudio.create({
        tokenCapturista: token,
        familia: newFamily
      });
      //save estudio
      return estudio.save();
    })
    .then((newEstudio) => {
      request.session.estudioId = newEstudio._id;
      request.session.familyId = newEstudio.familia._id;
      request.session.max_step = newEstudio.maxStep;

      response.locals.estudioId = request.session.estudioId;
      response.locals.max_step = request.session.max_step;
      return response.render('members');
    })
    .catch((error) => {
      //estudio could not be created
      console.log(error);
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
    //store estudioId in session
    request.session.estudioId = request.query.estudioId;
    const estudioId = request.session.estudioId;
    //get user token from session
    const token = request.session.user.apiToken;
    const data = request.body;
    let familyId;
    //get object with the new values for a family
    Estudio.findOne({_id: estudioId})
    .then((currEstudio) => {
      //save familyId at session
      familyId = currEstudio.familia._id;
      request.session.familyId = familyId;
      //create object with the new family data
      let editedFamily = familyController.editFamily(data, familyId);
      return editedFamily;
    })
    .then((editedFamily) => {
      //find and update estudio
      return Estudio.findOneAndUpdate({_id: estudioId},
      {
        familia: editedFamily
      });
    })
    .then((editedEstudio) => {
      //get all members
      return Miembro.find({familyId: familyId})
    })
    .then((allMemebrs) => {
      response.render('members', {
        // estudioId: estudioId,
        members: allMemebrs,
        // familyId: familyId,
      });
    })
    .catch((error) => {
      //estudio not edited
      console.log(error);
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
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
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
      console.log(e)
      response.render('dashboard', {
        estudios: e,
        active: myStatus
      });
    })
    .catch((err) => {
      console.log(e);
    })
  },

  saveImage: function (request, response) {
    var form = new formidable.IncomingForm();

    form.multiples = true;

    form.uploadDir = path.join(__dirname, '..', '../db');

    console.log(form.uploadDir);
    form.on('file', function (field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('error', function (err) {
      console.log('An error has ocurred: \n' + err);
    });

    form.on('end', function () {
      console.log('success');
      response.end('success');
    });

    form.parse(request);
  }
 }
