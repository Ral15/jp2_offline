const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Respuesta = require('../models/respuesta');
const Miembro = require('../models/miembro');
const familyController = require('./family');
const req = require('request');
const urls = require('../routes/urls');
const fs = require('fs');
const path = require('path');



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
      request.session.id_estudio = estudioId;
      response.locals.estudioId = request.session.id_estudio;
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
      console.log(request.session.id_estudio)
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
      //set id's
      estudioId = newEstudio._id;
      familyId = newEstudio.familia._id;
      console.log(estudioId);
      console.log(familyId);
      //store id's in session
      request.session.familyId = familyId;
      request.session.estudioId = estudioId;
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
  addAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idSeccion = Number(request.body.id_seccion);
    let aIndex = Number(request.body.index);
    let idEstudio = request.body.id_estudio;
    let valorRespuesta = request.body.answer;
    Respuesta.find({
      idEstudio: idEstudio,
      idPregunta: idPregunta
    }, {
      sort: 'orden'
    }).then((respuestas) => {
      let create = false;
      if(respuestas.length > 0){
        if(aIndex >= respuestas.length){
          aIndex = respuestas.length;
          create = true;
        } else {
          Respuesta.findOneAndUpdate({
            idEstudio: idEstudio,
            idPregunta: idPregunta,
            orden: aIndex
          },{
            respuesta: valorRespuesta
          }).then((respuesta) => {
            return response.sendStatus(200);
          })
          .catch((e) => {
            console.log(e);
            return response.sendStatus(500);
          });
        }
      }else{
        create = true;
      }
      if(create){
        let respuesta = Respuesta.create({
          idEstudio: idEstudio,
          idPregunta: idPregunta,
          idSeccion: idSeccion,
          orden: aIndex,
          eleccion: null,
          respuesta: valorRespuesta
        });
        respuesta.save().then((resp) => {
          response.sendStatus(200);
        });
      }
    });
  },
  addSelectAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idSeccion = Number(request.body.id_seccion);
    let valorRespuesta = Number(request.body.answer);
    let idEstudio = request.body.id_estudio;
    Respuesta.findOne({
      idEstudio: idEstudio,
      idPregunta: idPregunta
    }).then((respuesta) => {
      if(respuesta){
        respuesta.eleccion = valorRespuesta;
      } else {
        respuesta = Respuesta.create({
          idEstudio: idEstudio,
          idPregunta: idPregunta,
          idSeccion: idSeccion,
          eleccion: valorRespuesta,
          respuesta: null
        });
      }
      respuesta.save().then((resp) => {
        response.sendStatus(200);
      }).catch((err) => {
        console.log(err);
        response.sendStatus(500);
      });

    });
  },
  removeAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idEstudio = request.body.id_estudio;
    Respuesta.find({
      idEstudio: idEstudio,
      idPregunta: idPregunta
    }, {
      sort: 'orden'
    }).then((respuestas) => {
      respuestas[respuestas.length - 1].delete().then((complete) => {
        return response.sendStatus(200);
      }).catch((err) => {
        console.log(e);
        return response.sendStatus(500);
      });
    }).catch((err) => {
      console.log(e);
      return response.sendStatus(500);
    });
  },
  uploadEstudio: function (request, response) {
    req.post(
      urls.apiUrl + urls.api.uploadEstudio + request.params.id,
      {
        headers: {
          'Authorization': 'Token ' + request.session.apiToken,
        },

      },
      function (error, httpResponse, body) {
        if (httpResponse.statusCode > 201) {
          response.render('dashboard', { error_message: 'No se obtuvo la información' });
        } else {
          console.log(body)
        }
      });
  },

  saveImage: function (request, response) {
    fs.writeFile(request.body.image, path.join(__dirname, '..', '../db/images/', request.body.name + '.jpg'), function (err) {
      if (err) throw err;
      console.log("saved");
    });
  }
 }
