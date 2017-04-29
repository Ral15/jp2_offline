const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Transaccion = require('../models/transaccion');
const Miembro = require('../models/miembro');
const Periodo = require('../models/periodo');
const Escuela = require('../models/escuela');
const familyController = require('./family');
const estudioController = require('./estudio');
const userController = require('./user');
const req = require('request');
const rp = require('request-promise');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const schoolController = require('./school');
const jobController = require('./job');
const answerController = require('./answers');
const memberController = require('./member');

module.exports = {
  /**
  * This functions makes a GET to obtain all the Estudios associated to a 
  * capturista
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  getEstudios: function(request, response) {
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
  // getEstudio: function (request, response) {
  //   const estudioId = request.params.id;
  //   req.get(
  //     // Url to post
  //     urls.apiUrl + urls.api.login + estudioId,
  //     // Data for the post
  //     {
  //       headers: {
  //             'Authorization': 'Token ' + user.apiToken,
  //           },
  //     },
  //     // Callback
  //     function (error, httpResponse, body) {
  //       // If response FAILS show error message
  //       if (httpResponse.statusCode > 201) {
  //         response.render('login', { error_message: 'Usuario o contraseña invalidos' });
  //       } else {
  //         User.findOne({ username:  data.username })
  //         .then((doc) => {
  //           if (doc) {
  //             bcrypt.compare(data.password, doc.password, function (err, res) {
  //               if (err) console.log(err);
  //               else if (res) {
  //                 Estudio.find({ tokenCapturista: doc.apiToken, status: 'Borrador' })
  //                 .then((e) => {
  //                   request.session.user = doc;
  //                   response.render('dashboard', { user: doc, estudios: e, active: 'Borrador' });
  //                 })
  //                 .catch((error) => {
  //                   console.log(error);
  //                 });
  //               } else {
  //                 editedUser = self.resetPassword(doc, data);
  //                 SectionController.getQuestions(editedUser, request, response);
  //               }
  //             });
  //           } else {
  //             // Create new user with data from the form
  //             const newUser = User.create({
  //               username: data.username,
  //               password: data.password,
  //               apiToken: body.token,
  //             });
  //             // Try to save user at db
  //             newUser.save()
  //             .then((user) => {
  //               SectionController.getQuestions(user, request, response);
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //           }
  //         }).catch((err) => {
  //           console.log(err);
  //         });
  //       }
  //     });
  // },
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
    let ingresos;
    let egresos;
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
      return Escuela.find();
    })
    .then((sC) => {
      escuelas = sC;
      return Transaccion.find({familyId: familyId, isIngreso: false});
    })
    .then((tE) => {
      egresos = tE;
      return answerController.serialize(estudioId);
    })
    .then((respuestas) => {
      data = this.formatData(estudio, familia, tutores, estudiantes, ingresos, egresos, respuestas, escuelas);
      let userApiToken = request.session.user.apiToken;
      let estudioAPIId = request.session.estudioAPIId;
      if ( estudioAPIId == -1) {
        return this.createEstudioAPI(data, userApiToken);
      }
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
            console.log(httpResponse.body);
            if (httpResponse.statusCode > 201) {
              console.log(error)
              console.log('quien soy')
            }
            else {
              //TODO: add id to apiID
              // estudioController.addAPIId(body.id, request.session.estudioId)
              // .then((editedEstudio) => {
              //   console.log(editedEstudio);
              //   return userController.showDashboard(request, response, 'Revisión');
              // })
              // console.log(request.query.estudioAPIId);
              console.log(body);
            }
          }
        );      
      }
    })
    .then((body) => {
      console.log(JSON.stringify(body));
      return this.addAPIID(body, estudioId, familyId);
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
    console.log(JSON.stringify(data));
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
      // .then((body) => {
      //   // console.log('si armo')
      //   // console.log(JSON.stringify(body));
      //   return body;
      //   //TODO: add apiID to everything
      //   // estudioController.addAPIId(body.id, request.session.estudioId)
      //   // .then((editedEstudio) => {
      //   //   // console.log(editedEstudio);
      //   //   // userController.showDashboard(request, response, 'Revisión');
      //   //   console.log(editedEstudio);
      //   // });
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
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
  formatData: function(estudio, family, tutors, students, incomes, outcomes, answers, schools) {
    return {
      familia: {
        numero_hijos_diferentes_papas: family.bastardos,
        explicacion_solvencia: family.explicacionSolvencia,
        estado_civil: family.estadoCivil,
        localidad: family.localidad,
        comentario_familia: [],
        integrante_familia: this.formatFamily(tutors, students, incomes, schools),
        transacciones: this.formatTransactions(family._id, incomes, outcomes),
      },
      respuesta_estudio: answers,
      status: 'borrador'
    }
  },
  /**
  * This functions parses the family
  *
  * @event
  * @param {array} tutors - array with all tutors from a family
  * @param {array} students - all students from a family
  * @param {array} incomes - all incomes from a family
  */     
  formatFamily: function(tutors, students, incomes, schools) {
    let formatedTutors = this.formatTutores(tutors, incomes);
    //TODO:: formatStudents
    let formatedStudents = this.formatStudents(students, schools);
    return formatedTutors.concat(formatedStudents);
  },  
  /**
  * This functions parses all tutors associated to a family
  *
  * @event
  * @param {array} tutors - array with all tutors from a family
  * @param {array} incomes - all incomes from a family
  */      
  formatTutores: function (tutors, incomes) {
    let myTutors;
    let myIncomes;
    myTutors = tutors.map((t) => {
      myIncomes = this.formatIncomesTutors(incomes, t._id);
      return {
        nombres: t.nombres,
        apellidos: t.apellidos,
        telefono: t.telefono,
        correo: t.correo,
        nivel_estudios: t.nivelEstudios,
        fecha_de_nacimiento: t.fechaNacimiento,
        alumno_integrante: null,
        tutor_integrante: {
          relacion: t.relacion,
          tutor_ingresos: myIncomes,
        }
      }
    });
    return myTutors;
  },
  /**
  * This function parses all students associated to a family
  *
  * @event
  * @param {array} students - array with all students from a family
  * @param {array} schools - all schools from a family
  */   
  formatStudents: function(students, schools) {
    let myStudents;
    myStudents = students.map((s) => {
      let mySchool = schools.find((sc) => sc._id == s.escuela);
      return {
        nombres: s.nombres,
        apellidos: s.apellidos,
        telefono: s.telefono,
        correo: s.correo,
        nivel_estudios: s.nivelEstudios,
        fecha_de_nacimiento: s.fechaNacimiento,
        alumno_integrante: {
          // sae: s.sae
          activo: s.activo,
          escuela: {
            id: mySchool.apiId,
            nombre: mySchool.nombre
          }
        },
        tutor_integrante: null
      }
    });
    return myStudents;
  },
  /**
  * This functions parses all incomes associated to a tutor
  *
  * @event
  * @param {array} incomes - array with all incomes from a family
  * @param {string} id - id of tutor
  */    
  formatIncomesTutors: function(incomes, id) {
    //filter incomes of the member
    let formatIncome = incomes.filter((i) => {
      return i.miembroId == id;
    }).map((i) => { //map through all filtered incomes
      // if (i.miembroId == id) {
      return {
            fecha: '2003-03-19',
            tipo: i.tipo,
            transaccion: {
              activo: i.isActivo,
              monto: i.monto,
              periodicidad: {
                periodicidad: i.periocidad.periodicidad,
                factor: i.periocidad.factor,
                multiplica: i.periocidad.multiplica,
              },
              observacion: i.observacion,
              es_ingreso: true
            }
          }
      // }
        // else return null;
    });
    return formatIncome;
  },
  /**
  * This functions parses all incomes and outcomes from a family
  *
  * @event
  * @param {string} familyId - id of the 
  * @param {array} incomes - array with all incomes
  * @param {array} outcomes - array with all outcomes
  */  
  formatTransactions: function(familyId, incomes, outcomes) {
    let allIncomes = incomes.map((i) => {
      return {
        activo: true,
        monto: i.monto,
        periodicidad: {
          periodicidad: i.periocidad.periodicidad,
          factor: i.periocidad.factor,
          multiplica: i.periocidad.multiplica,
        },
        observacion: i.observacion,
        es_ingreso: true
      }
    });
    let allOutcomes = outcomes.map((e) => {
      return {
        activo: true,
        monto: e.monto,
        periodicidad: {
          periodicidad: e.periocidad.periodicidad,
          factor: e.periocidad.factor,
          multiplica: e.periocidad.multiplica,
        },
        observacion: e.observacion,
        es_ingreso: false
      }
    });
    let all = allIncomes.concat(allOutcomes);
    return all;
  },
  //assuming i have the offline_id, missing transactions of members and answers
  addAPIID: function(data, estudioId, familyId) {
    return familyController.addAPIId(data.familia, familyId)
      .then((nF) => {
        console.log(nF);
        return estudioController.addAPIId(data.id, familyId, nF);
      })
      .then((nE) => {
        console.log(nE);
        let editedMembers = memberController.addAPIId(data.familia.integrante_familia, familyId);
        // console.log('dsp' + editedMembers);
        return editedMembers;
      })
      .then((nM) => {
        console.log(nM);
        // return transactionController.addAPIId(data.transacciones, )
      })
  },
};