const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Transaccion = require('../models/transaccion');
const Miembro = require('../models/miembro');
const Periodo = require('../models/periodo');
const familyController = require('./family');
const estudioConctroller = require('./estudio');
const userController = require('./user');
const rp = require('request-promise');
const isOnline = require('is-online');
const urls = require('../routes/urls');
const schoolController = require('./school');
const jobController = require('./job');



module.exports = {
  getSchools: function(userApiToken) {
    let options = {
      uri: urls.apiUrl + urls.api.schools,
      headers: {
          'Authorization': 'Token ' + userApiToken,
      },
      json: true
    };
    return rp(options)
      .then((data) => {
        let school = schoolController.saveSchool(data);
        return school;
      })
      .then((s) => {
        return s;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getJobs: function(userApiToken) {
    let options = {
      uri: urls.apiUrl + urls.api.jobs,
      headers: {
          'Authorization': 'Token ' + userApiToken,
      },
      json: true
    };
    return rp(options)
      .then((data) => {
        let jobs = jobsController.saveJobs(data);
        return jobs;
      })
      .then((j) => {
        return j;
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
  uploadEstudio: function(request, response) {
    // console.log(request.method);
    // return 1;
    let estudio;
    let familia;
    let tutores;
    let estudiantes;
    let ingresos;
    let egresos;
    let data;
    Estudio.findOne({_id: request.session.estudioId})
    .then((e) => {
      estudio = e;
      return Familia.findOne({_id: request.session.familyId});
    })
    .then((f) => {
      familia = f;
      console.log(f);
      return Miembro.find({familyId: request.session.familyId});
    })
    .then((m) => {
      miembros = m;
      estudiantes = m.filter((m) => m.relacion == 'estudiante');
      tutores = m.filter((m) => m.relacion == 'tutor' || m.relacion == 'madre' || m.relacion == 'padre');
      return Transaccion.find({familyId: request.session.familyId, isIngreso: true});
    })
    .then((tI) => {
      ingresos = tI;
      return Transaccion.find({familyId: request.session.familyId, isIngreso: false});
    })
    .then((tE) => {
      egresos = tE;
      data = this.formatData(estudio, familia, tutores, estudiantes, ingresos, egresos);
      // data = this.formatTutores(tutores, ingresos);
      console.log(JSON.stringify(data));
      let finD = JSON.stringify(data);
      // return 1;
      // return data;
      //create estudio in api
      console.log(request.session.estudioAPIId);
      // return 1;
      if (request.session.estudioAPIId == -1) {
        return req.post(
          urls.apiUrl + urls.api.estudios,
          {
            headers: {
                  'Authorization': 'Token ' + request.session.user.apiToken,
                }, 
            json: data
          },
          function(error, httpResponse, body) {
            console.log(httpResponse.body);
            if (httpResponse.statusCode > 201) {
              response.send(error);
              console.log('quien soy');
            }
            else {
              //TODO: add id to apiID
              estudioConctroller.addAPIId(body.id, request.session.estudioId)
              .then((editedEstudio) => {
                // console.log(editedEstudio);
                return userController.showDashboard(request, response, 'Revisión');
              })
            }
          }
        );   
      }
      else {
        data.status = "borrador";
        data.id = request.session.estudioAPIId;
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
              // estudioConctroller.addAPIId(body.id, request.session.estudioId)
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
    .catch((err) => {
      console.log(err);
    });
  },
  // askAPI: function(url, method, data) {}
  formatData: function(Estudio, Familia, Tutores, Estudiantes, Ingresos, Egresos) {
    return {
      familia: {
        numero_hijos_diferentes_papas: Familia.bastardos,
        explicacion_solvencia: '',
        estado_civil: Familia.estadoCivil,
        localidad: Familia.localidad,
        comentario_familia: [],
        // integrante_familia: [],
        integrante_familia: this.formatFamily(Tutores, Estudiantes, Ingresos),
        transacciones: this.formatTransactions(Familia._id, Ingresos, Egresos),
        // transacciones: [],
      },
      respuesta_estudio: [],
      status: 'borrador'
    }
  },
  formatFamily: function(tutores, estudiantes, ingresos) {
    let tutors = this.formatTutores(tutores, ingresos);
    return tutors;
  },
  formatTutores: function (tutores, ingresos) {
    let myTutors;
    let myIncomes;
    myTutors = tutores.map((t) => {
      myIncomes = this.formatIncomesTutors(ingresos, t._id);
      return {
        nombres: t.nombres,
        apellidos: t.apellidos,
        telefono: t.telefono,
        correo: t.correo,
        nivel_estudios: t.nivelEstudios,
        fecha_de_nacimiento: '2003-03-19',
        alumno_integrante: null,
        tutor_integrante: {
          relacion: t.relacion,
          tutor_ingresos: myIncomes,
        }
      }
    });
    return myTutors;
  },
  formatIncomesTutors: function(ingresos, id) {
    let formatIncome = ingresos.filter((i) => {
      return i.miembroId == id;
    }).map((i) => {
      if (i.miembroId == id) {
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
        }
        else return null;
    });
    return formatIncome;
  },
  // formatEstudiantes: function(estudiantes) {
  //   {Miembros.forEach((m) => {
  //         nombres: m.nombres,
  //         apellidos: m.apellidos,
  //         telefono: m.telefono,
  //         correo: m.correo,
  //         nivel_estudios: m.nivelEstudios,
  //         fecha_de_nacimiento:,
  //         alumno_integrante: {},
  //         tutor_integrante: {},
  //       ],
  //     },
  formatTransactions: function(familyId, ingresos, egresos) {
    let allIncomes = ingresos.map((i) => {
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
    let allOutcomes = egresos.map((e) => {
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
};