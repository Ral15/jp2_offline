const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
const Estudio = require('../models/estudio');
const Escuela = require('../models/escuela');
const Oficio = require('../models/oficio');
const Estudiante = require('../models/estudiante');
const schoolController = require('./school');
const incomeController = require('./income');
module.exports = {
  /**
  * This function creates a member with a familyId
  * 
  * @event
  * @param {object} request - request from the form
  * @param {object} response - response form the form
  *
  */     
  addMember: function(request, response) {
    //get all data from POST
    const data = request.body;
    //get familyId
    // console.log(data.birthDate);
    // return 1;
    const familyId = request.session.familyId;
    //create member object
    let myMember = this.createMember(data, familyId);
    //save member
    return myMember.save()
    .then((newMember) => {
      return this.showMemberView(request, response);
    })
    .catch((err) => {
      console.log(err);
    });
  },
  /**
  * This functions edits the information of a previously saved member.
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  editMember: function (request, response) {
    //get all data from POST
    const data = request.body;
    console.log(data);
    //get family id from session
    const familyId = request.session.familyId;
    //get member Id from query
    const memberId = request.params.id;
    //call promise that will update the info of the member
    let myMember = this.editMemberInfo(data, memberId);
    //resolve promise
    return myMember.then((newMember) => {
      console.log(newMember);
      //retrieve from db all miembros that share the same familyId
      return this.showMemberView(request, response);
    })
    .catch((err) => {
      console.log(err);
    });
  },
  /**
  * This function adds a Member to a Family
  * 
  * 
  * @event
  * @param {object} data - data of the memeber 
  */   
  createMember: function(data, id) {
    return Miembro.create({
      familyId: id,
      nombres: data.firstName,
      apellidos: data.lastName, 
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      relacion: data.role,
      sae: data.sae,
      escuela: data.school,
      sacramentos: data.sacramentos,
      terapia: data.terapia,
      oficio: data.job,
      observacionOficio: data.jobObservation,
      observacionEscuela: data.schoolObservation,
    });
  },
  /**
  * This function edits the information of a previously
  * saved Member
  * 
  * 
  * @event
  * @param {object} data - data of the memeber 
  * @param {string} id - id of the member to update
  */     
  editMemberInfo: function(data, id) {
    return Miembro.findOneAndUpdate({_id : id}, {
      nombres: data.firstName,
      apellidos: data.lastName, 
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      sacramentos: data.sacramentos,
      terapia: data.terapia,
      relacion: data.role,
      sae: data.sae,
      escuela: data.school,
      oficio: data.job,
      observacionOficio: data.jobObservation,
      observacionEscuela: data.schoolObservation,      
    });
  },  
  /**
  * This function deletes a member
  * 
  * 
  * @event
  * @param {object} request - request object
  * @param {object} response - response object
  *
  */    
  deleteMember: function(request, response) {
    //retrieve member id from request
    const memberId = request.params.id;
    //*** delete function did not work, fuck you camo
    return Miembro.findOneAndDelete({_id: memberId})
    .then((m) => {
      return response.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return response.sendStatus(500);
    });
  },
  /**
   * This function retrieves all the members associated to a familyId and 
   * renders the members page.
   *
   * @event
   * @param {object} request - request object
   * @param {object} response - response object.
   */   
  showMemberView: function(request, response) {
    //get family id
    const familyId = request.session.familyId;
    response.locals.estudioActive = 'members';
    let allMembers;
    let allSchools;
    let allJobs;
    return Miembro.find({ familyId: familyId })
    .then((m) => {
      allMembers = m;
      return Escuela.find();
    })
    .then((s) => {
      allSchools = s;
      return Oficio.find();
    })
    .then((o) => {
      allJobs = o;
      // console.log(allJobs);
      return response.render('members', {
        members: allMembers,
        schools: allSchools,
        jobs: allJobs,
      });
    })
    .catch((error) => {
      console.log(error);
    })      
  },
  //assuming i have data.offline_id
  addAPIId: function(data, familyId, schools, jobs) {
    let myMembers = [];
    data.map((d) => {
      var m;
      let myJob = jobs.find((j) => j.apiId = d.oficio.id);
      if (d.alumno_integrante == null) {
        m = new Promise((resolve, reject) => {
          resolve(Miembro.findOneAndUpdate(
            { _id: d.offline_id }, 
            {
              apiId: d.id,
              nombres: d.nombres,
              apellidos: d.apellidos,
              telefono: d.telefono,
              correo: d.correo,
              nivelEstudios: d.nivel_estudios,
              fechaNacimiento: d.fecha_de_nacimiento,
              relacionId: d.tutor_integrante.id,
              relacion: d.tutor_integrante.relacion,
              terapia: d.historial_terapia,
              sacramentos: d.sacramentos_faltantes,
              observacionOficio: d.especificacion_oficio,
              observacionEscuela: d.especificacion_estudio,
              oficio: myJob._id,
            })
          );
        }); 
      }
      else {
        let schoolId = schools.find((sc) => sc.apiId == d.alumno_integrante.escuela.id);
        console.log(schoolId._id);
        m = new Promise((resolve, reject) => {
          resolve(Miembro.findOneAndUpdate(
            { _id: d.offline_id }, 
            {
              apiId: d.id,
              nombres: d.nombres,
              apellidos: d.apellidos,
              telefono: d.telefono,
              correo: d.correo,
              nivelEstudios: d.nivel_estudios,
              fechaNacimiento: d.fecha_de_nacimiento,
              relacionId: d.alumno_integrante.id,
              relacion: 'estudiante',
              terapia: d.historial_terapia,
              sacramentos: d.sacramentos_faltantes,
              observacionOficio: d.especificacion_oficio,
              observacionEscuela: d.especificacion_estudio,
              oficio: myJob._id,
              escuela: schoolId._id,
              sae: d.alumno_integrante.numero_sae
            }).catch((err) => {
              console.log(err);
            })
          );
        });
      }
      myMembers.push(m);
    });
    return Promise.all(myMembers);
  },
/**
  * This functions parses all tutors associated to a family
  *
  * @event
  * @param {array} tutors - array with all tutors from a family
  * @param {array} incomes - all incomes from a family
  */      
  formatTutores: function (tutors, incomes, jobs) {
    let myTutors;
    let myIncomes;
    myTutors = tutors.map((t) => {
      myIncomes = incomeController.formatIncomesTutors(incomes, t._id);
      console.log(myIncomes);
      let myJob = jobs.find((j) => j._id == t.oficio);
      return {
        nombres: t.nombres,
        apellidos: t.apellidos,
        telefono: t.telefono,
        correo: t.correo,
        historial_terapia: t.terapia,
        rol: t.relacion,
        offline_id: t._id,
        especificacion_oficio: t.observacionOficio,
        especificacion_estudio: t.observacionEscuela,
        sacramentos_faltantes: t.sacramentos,
        nivel_estudios: t.nivelEstudios,
        fecha_de_nacimiento: t.fechaNacimiento,
        oficio: {
          id: myJob.apiId,
          nombre: myJob.nombre
        },
        alumno_integrante: null,
        tutor_integrante: {
          relacion: t.relacion,
          tutor_ingresos: myIncomes,
        },
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
  formatStudents: function(students, schools, jobs) {
    let myStudents;
    myStudents = students.map((s) => {
      let mySchool = schools.find((sc) => sc._id == s.escuela);
      let myJob = jobs.find((j) => j._id == s.oficio);
      return {
        nombres: s.nombres,
        apellidos: s.apellidos,
        telefono: s.telefono,
        correo: s.correo,
        rol: s.relacion,
        offline_id: s._id,
        historial_terapia: s.terapia,
        sacramentos_faltantes: s.sacramentos,
        especificacion_oficio: s.observacionOficio,
        especificacion_estudio: s.observacionEscuela,
        nivel_estudios: s.nivelEstudios,
        oficio: {
          id: myJob.apiId,
          nombre: myJob.nombre
        },
        fecha_de_nacimiento: s.fechaNacimiento,
        alumno_integrante: {
          numero_sae: s.sae,
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
  updateFullMembersAPI: function(data, familyId, schools, jobs){
    let myMembers = [];
    data.map((d) => {
      let m;
      let myJob = jobs.find((j) => j.apiId = d.oficio.id);
      if (d.alumno_integrante == null) {
        m = new Promise((resolve, reject) => {
          resolve(Miembro.findOneAndUpdate(
            { apiId: d.id }, 
            {
              familyId: familyId,
              apiId: d.id,
              nombres: d.nombres,
              apellidos: d.apellidos,
              telefono: d.telefono,
              correo: d.correo,
              nivelEstudios: d.nivel_estudios,
              fechaNacimiento: d.fecha_de_nacimiento,
              relacionId: d.tutor_integrante.id,
              relacion: d.tutor_integrante.relacion,
              terapia: d.historial_terapia,
              sacramentos: d.sacramentos_faltantes,
              observacionOficio: d.especificacion_oficio,
              observacionEscuela: d.especificacion_estudio,
              oficio: myJob._id,
            },
            {upsert:true})
            .catch((err) => {
              console.log(err);
            })
          );
        }); 
      }
      else {
        let schoolId = schools.find((sc) => sc.apiId == d.alumno_integrante.escuela.id);
        // console.log(schoolId._id);
        m = new Promise((resolve, reject) => {
          resolve(Miembro.findOneAndUpdate(
            { apiId: d.id }, 
            {
              familyId: familyId,
              apiId: d.id,
              nombres: d.nombres,
              apellidos: d.apellidos,
              telefono: d.telefono,
              correo: d.correo,
              nivelEstudios: d.nivel_estudios,
              fechaNacimiento: d.fecha_de_nacimiento,
              relacionId: d.alumno_integrante.id,
              relacion: 'estudiante',
              terapia: d.historial_terapia,
              sacramentos: d.sacramentos_faltantes,
              observacionOficio: d.especificacion_oficio,
              observacionEscuela: d.especificacion_estudio,
              oficio: myJob._id,
              escuela: schoolId._id,
              sae: d.alumno_integrante.numero_sae
            },
            {upsert:true})
            .catch((err) => {
              console.log(err);
            })
          );
        });
      }
      myMembers.push(m);
    });
    return Promise.all(myMembers);
  }    
}