const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Escuela = require('../models/escuela');
const Miembro = require('../models/miembro');
const Oficio = require('../models/oficio');
const Comentario = require('../models/comentario');
const Transaccion = require('../models/transaccion');
const familyController = require('./family');
const memberController = require('./member');
const commentController = require('./comment');
const transactionsController = require('./transaction');
const req = require('request');
const isOnline = require('is-online');
const answerController = require('./answers');
const userController = require('./user');
const urls = require('../routes/urls');
const rp = require('request-promise');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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
    response.locals.estudioActive = 'family';
    // console.log(estudioId);
    if (estudioId) {
      request.session.estudioId = estudioId;
      response.locals.estudioId = request.session.estudioId;
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        console.log(myEstudio)
        //set session variables
        request.session.estudioAPIId = myEstudio.apiId;
        request.session.familyId = myEstudio.familia._id;
        console.log('soy el EstudioapiID: '+ request.session.estudioAPIId);
        return response.render('family',  {
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
    console.log('es el create');
    const token = request.session.user.apiToken;
    //get data from request
    const data = request.body;
    //create familia
    let newFamily = familyController.createFamily(data);
    //save familia
    return newFamily.save()
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
      request.session.estudioAPIId = -1;
      request.session.estudioId = newEstudio._id;
      response.locals.estudioId = request.session.estudioId;
      request.session.familyId = newEstudio.familia._id;
      return memberController.showMemberView(request, response);
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
    // console.log('esl e edit');
    request.session.estudioId = request.query.estudioId;
    const estudioId = request.session.estudioId;
    //get user token from session
    const token = request.session.user.apiToken;
    const data = request.body;
    let familyId;
    //get object with the new values for a family
    return Estudio.findOne({_id: estudioId})
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
      return memberController.showMemberView(request, response);
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
  /**
  * This function returns the update promise of the Estudio
  * 
  * 
  * @event
  * @param {number} apiId - apiId to add  
  * @param {string} estudioId - estudioId to update
  */    
  addAPIIdEstudio: function(apiId, estudioId, family) {
    return Estudio.findOneAndUpdate({
      _id: estudioId
    },
    {
      apiId: apiId,
      status: 'Revisión',
      familia: family,
    });
  },
  /**
  * This should be called at the init of an estudio and at the upload
  * This functions validates if an estudio can be uploades. It needs:
  * 1 family
  * 2 Members, 1 student 1 tutor
  * 2 Transactions, 1 income 1 outcome
  * TODO: 1 img from Vivienda
  * It will return true if everything is OK
  * 
  * @event
  * @param {number} apiId - apiId to add  
  * @param {string} estudioId - estudioId to update
  */      
  isEstudioValid: function(familyId) {
    //set variables that will hold count value
    let tutorsCount = 0;
    let studentsCount = 0;
    let incomeCount = 0;
    let outcomeCount = 0;
    //find all members
    return Miembro.find({familyId: familyId})
    .then((members) => {
      //iterate through all members and add to counter depending on the role
      members.map((m) => {
        if (m.relacion == 'madre' || m.relacion == 'padre' || m.relacion == 'tutor' )  {
          tutorsCount ++;
        }
        else if (m.relacion == 'estudiante') {
          studentsCount ++;
        }
      });
      //get incomes
      return Transaccion.count({familyId: familyId, isIngreso: true});
    })
    .then((i) => {
      incomeCount += i;
      //get outcomes
      return Transaccion.count({familyId: familyId, isIngreso: false});
    })
    .then((o) => {
      outcomeCount += o;
      //check the restriction
      if (studentsCount >= 1 && tutorsCount >= 1 && 
          incomeCount >= 1 && outcomeCount >= 1) {
        return true;
      }
      else return false;
    })
    .catch((err) => {
      console.log(err);
    });
  },
  updateEstudios: function(request, response){
    let user = request.session.user;
    let self = this;
    isOnline().then((online) => {
      if(online){
        req.get(
          // url to get
          urls.apiUrl + urls.api.estudios,
          {
            headers: {
              'Authorization': 'Token ' + user.apiToken,
            },
          },
          function (error, httpResponse, body) {
            if(httpResponse.statusCode == 404){
              response.locals.error_message = 'No hay estudios de este usuario';
              return userController.showDashboard(request,response, 'Borrador');
            } else if (httpResponse.statusCode > 201) {
              response.locals.error_message = 'No se pudo obtener la informacion';
              return userController.showDashboard(request,response, 'Borrador');
            } else {
              const data = JSON.parse(body);
              let token = request.session.user.apiToken;
              data.forEach(async function(estudio){
                await self.updateFullEstudioFromAPI(estudio, token);
              });
              return response.redirect(urls.dashboard);
            }
          });
      } else {
        response.locals.error_message = 'No hay conexion a internet';
        return userController.showDashboard(request,response, 'Borrador');
      }
    });
  },
  updateFullEstudioFromAPI: function(estudio, token){
    familyController.updateFamilyFromAPI(estudio.familia)
    .then((family) => {
      return this.updateEstudioFromAPI(estudio, family, token);
    })
    .then((study) => {
      // console.log("ESTUDIO");
      console.log("Estudio ID API #"+study.apiId+" recibido bien");
    })
    .catch((err) => {
      console.log("estudioApi "+estudio.id+":"+err);
    })
  },
  updateEstudioFromAPI: function(data, family, token){
    let OPCIONES_STATUS = {
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'borrador': 'Borrador',
      'revision': 'Revisión',
      'eliminado_capturista': 'Eliminado',
      'eliminado_administrador': 'Eliminado'
    };
    return Estudio.findOneAndUpdate({
      apiId: data.id
    },
    {
      apiId: data.id,
      status: OPCIONES_STATUS[data.status],
      familia: family,
      tokenCapturista: token
    },
    {
      upsert: true
    });
  },
  /**
  * This functions show the upload estudio view
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  showUploadView: function(request, response) {
    response.locals.estudioActive = 'upload';
    // console.log(request.session);
    let familyId;
    let allComments;
    if (request.query.familyId) familyId = request.query.familyId;
    else familyId = request.session.familyId;
    return commentController.getComments(request.session.estudioId)
    .then((c) => {
      allComments = c;
      return this.isEstudioValid(familyId);
    })
    .then((value) => {
      console.log('soy el value => ' + value);
      response.locals.isValid = value;
      return response.render('uploadEstudio', {
        comments: allComments
      });
    })
    .catch((err) => {
      console.log(err);
    })
  },
/**
  * This functions makes a PUT or POST dependeing if the estudio has apiID
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  uploadEstudio: function(request, response) {
    //set id variables
    let estudioId = request.session.estudioId;
    let familyId = request.session.familyId;
    //declare variables that will contain all my data
    let estudio;
    let familia;
    let tutores;
    let estudiantes;
    let comentarios;
    let ingresos;
    let egresos;
    let oficios;
    let escuelas;
    let data;
    return Estudio.findOne({_id: estudioId})
    .then((e) => {
      estudio = e;
      return Familia.findOne({_id: familyId});
    })
    .then((f) => {
      familia = f;
      return Miembro.find({familyId: familyId});
    })
    .then((m) => {
      miembros = m;
      estudiantes = m.filter((m) => m.relacion == 'estudiante');
      tutores = m.filter((m) => m.relacion == 'tutor' || m.relacion == 'madre' || m.relacion == 'padre');
      return Transaccion.find({familyId: familyId, isIngreso: true});
    })
    .then((tI) => {
      ingresos = tI;
      return Comentario.find({estudioId: estudioId});
    })
    .then((c) => {
      comentarios = c;
      return Escuela.find();
    })
    .then((sC) => {
      escuelas = sC;
      return Oficio.find();
    }).then((o) => {
      oficios = o;
      return Transaccion.find({familyId: familyId, isIngreso: false});
    })
    .then((tE) => {
      egresos = tE;
      return answerController.serialize(estudioId);
    })
    .then((respuestas) => {
      data = this.formatData(estudio, familia, tutores, estudiantes, ingresos, egresos, respuestas, escuelas, oficios, comentarios);
      let userApiToken = request.session.user.apiToken;
      let estudioAPIId = request.session.estudioAPIId;
      //POST to create estudio
      //TODO: REMOVE
      console.log(JSON.stringify(data));//data that is send to API
      if ( estudioAPIId == -1) {
        return this.createEstudioAPI(data, userApiToken);
      }
      //TODO: retrieve info from models and change req to rp.
      else {
        data.status = "borrador"; // this is only for testing rn
        data.id = estudioAPIId;
        return req.put(
          urls.apiUrl + urls.api.estudios + request.session.estudioAPIId + '/',
          {
            headers: {
                  'Authorization': 'Token ' + request.session.user.apiToken,
                },
            json: data
          },
          function(error, httpResponse, body) {
            // console.log(httpResponse.body);
            if (httpResponse.statusCode > 201) {
              console.log(error)
              console.log('quien soy')
            }
            else {
              console.log(body);
            }
          }
        );      
      }
    })
    .then((body) => {
      //TODO: remoove
      console.log(JSON.stringify(body)); //response from API
      return this.addAPIID(body, estudioId, familyId, escuelas, oficios);
    })
    .then(() => {
      return userController.showDashboard(request, response, 'Revisión');
    })
    .catch((err) => {
      console.log(err);
    });
  },
  /**
  * This functions makes a POST to the API in order to create the Estudio
  *
  * @event
  * @param {object} data - data to be send in the body of the POST
  * @param {string} userApiToken - token that will auth 
  */        
  createEstudioAPI: function(data, userApiToken) {
    // console.log(JSON.stringify(data));
    let options = {
      method: 'POST',
      uri: urls.apiUrl + urls.api.estudios,
      headers: {
          'Authorization': 'Token ' + userApiToken,
      },
      body: data,
      json: true,
    };    
    return rp(options);
  },
  /**
  * This functions makes a POST to the API in order to create the Estudio
  * 
  *
  * @event
  * @param {object} data - data to be send in the body of the POST
  * @param {string} userApiToken - token that will auth 
  */ 
  editEstudioAPI: function(data, userApiToken) {
    let options = {
      method: 'PUT',
      uri: urls.apiUrl + urls.api.estudios + data.id + '/',
      headers: {
          'Authorization': 'Token ' + userApiToken,
      },
      body: data,
      json: true,      
    };
  },      
/**
  * This functions parses all data necessary for POST body
  *
  * @event
  * @param {object} estudio - estudio object
  * @param {object} family - family object associated to an estudio
  * @param {array} tutors - all tutors from a family
  * @param {array} students - all students from a family
  * @param {array} incomes - array with all incomes from a family & members
  * @param {array} outcomes - array with all outcomes from a family & members
  * @param {array} answers - array with all answers from a estudio
  */     
  formatData: function(estudio, family, tutors, students, incomes, outcomes, answers, schools, jobs, comments) {
    return {
      familia: {
        numero_hijos_diferentes_papas: family.bastardos,
        direccion: family.calle + ' ' + family.colonia + ' ' + family.codigoPostal,
        explicacion_solvencia: family.explicacionSolvencia,
        nombre_familiar: family.nombreFamilia,
        estado_civil: family.estadoCivil,
        localidad: family.localidad,
        comentario_familia: commentController.formatComments(comments),
        integrante_familia: familyController.formatFamily(tutors, students, incomes, schools, jobs),
        transacciones: transactionsController.formatTransactions(family._id, incomes, outcomes),
      },
      respuesta_estudio: answers,
      status: 'borrador'
    }
  },

  /**
  * This functions adds the apiID once an estudio is uploaded the first time
  *
  *
  * @event
  * @param {string} familyId - id of the 
  * @param {array} incomes - array with all incomes
  * @param {array} outcomes - array with all outcomes
  */    
  addAPIID: function(data, estudioId, familyId, schools, jobs) {
    return familyController.addAPIId(data.familia, familyId)
      .then((nF) => {
        return this.addAPIIdEstudio(data.id, estudioId, nF); //replace familyId
      })
      .then((nE) => {
        let editedMembers = memberController.addAPIId(data.familia.integrante_familia, familyId, schools, jobs);
        return editedMembers;
      })
      .then((nM) => {
        // console.log(nM);
        return transactionsController.addAPIId(data.familia.transacciones, familyId, null);
      })
      .then((tS) => {
        // console.log(tS);
        return commentController.addAPIId(data.familia.comentario_familia);
      })
      .then((c) => {
        // console.log(c);
        // return userController.showDashboard()
      })
      .catch((err) => {
        console.log(err);
      });
  },
/**
  * This functions makes a GET to obtain all the Estudios associated to a 
  * capturista
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  getEstudiosAPI: function(request, response) {
    //retrieve estudio id from url
    req.get(
      urls.apiUrl + urls.api.estudios,
      {
        headers: {
              'Authorization': 'Token ' + request.session.user.apiToken,
            },
      },
      function(error, httpResponse, body) {
        if (httpResponse.statusCode > 201) {
          console.log(error)
        }
        else {
          console.log(JSON.parse(body)); 
        }
      }
    );
  },
/**
  * This function changes the status of a Estudio to 'Borrador'
  * using the id of the estudio
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */ 
  restoreEstudio: function(request, response) {
    let estudioId = request.params.id;
    //find estudio
    Estudio.findOneAndUpdate({
      _id: estudioId
    },
    {
      status: 'Borrador'
    })
    .then((myEstudio) => {
        return response.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
    });    
  },      
}