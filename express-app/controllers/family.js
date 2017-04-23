const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
const Estudio = require('../models/estudio');
const Estudiante = require('../models/estudiante');

module.exports = {
  /**
  * This function returns a a created family
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createFamily: function(data) {
    return Familia.create({
      bastardos: Number(data.bastards),
      estadoCivil: data.martialStatus,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode),
      localidad: data.location,
      nombreFamilia: data.familyName,
    });
  },
  /**
  * This funciton finds a Familia using the id and updates its data. It returns
  * a promise that when solved returns the updated Familia object
  * @event
  * @param {object} data - data from the form
  */  
  editFamily: function(data, id) {
    return Familia.findOneAndUpdate(
    {
      _id: id
    },
    {
      bastardos: Number(data.bastards),
      estadoCivil: data.martialStatus,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode),
      localidad: data.location,
      nombreFamilia: data.familyName,
    });
  },
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
    //get estudioId
    const estudioId = request.session.estudioId;
    //get familyId
    const familyId = request.session.familyId;
    //create member object
    let myMember = this.createMember(data, familyId);
    //save member
    myMember.save()
    .then((newMember) => {
      //get all members
      return Miembro.find({familyId: familyId});
    })
    .then((allMembers) => {
      console.log(allMembers);
      //render members view with the info
      return response.render('members', {
        // estudioId: estudioId,
        members: allMembers,
        // familyId: familyId,
      });
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
    //get family id from session
    const familyId = request.session.familyId;
    //get estudioId from session
    const estudioId = request.session.estudioId;
    //get member Id from query
    const memberId = request.query.memberId;
    //call promise that will update the info of the member
    let myMember = this.editMemberInfo(data, memberId);
    //resolve promise
    myMember.then((newMember) => {
      //retrieve from db all miembros that share the same familyId
      return Miembro.find({familyId: familyId});
    })
    .then((allMembers) => {
      //renders members view with the new information updated
      return response.render('members', {
        // estudioId: estudioId,
        members: allMembers,
        // familyId: familyId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  },
  /**
  ***********************DEPRECATED**********************************
  * This functions converts data from POST to a more handable object
  * 
  * @event
  * @param {object} data - data from request
  */ 
  parseData: function(data) {
    let newArray = data[Object.keys(data)[0]].map((v, i) => {
      let obj = {};
      for (let k in data) {
        obj[k] = data[k][i];
      }
      return obj;
    });
    return newArray;
  },
  /**
  ** TODO **
  * This function adds a Transaction to a Member from a Family
  * 
  * 
  * @event
  * @param {object} data - data of the memeber 
  */  
  addIncomeMember: function(transaction, request, response) {
    const estudioId = request.query.estudioId;

  },
  /**
  ** TODO ***
  * This function adds a Transaction to a Family
  * 
  * 
  * @event
  * @param {object} data - data of the memeber 
  */  
  addIncomeFamily: function(transaction, request, response) {
    const estudioId = request.query.estudioId;
    console.log(estudioId);
     Estudio.findOne({ _id: estudioId })
    .then((currEstudio) => {
      const newFamily = {
        calle: currEstudio.familia.calle,
        colonia: currEstudio.familia.colonia,
        bastardos: currEstudio.familia.bastardos,
        estadoCivil: currEstudio.familia.estadoCivil,
        codigoPostal: currEstudio.familia.codigoPostal,
        localidad: currEstudio.familia.localidad,
        miembros: [currEstudio.familia.miembros],
      };
      return Estudio.findOneAndUpdate({_id: estudioId}, {familia: newFamily});
    })
    .then((newEstudio) => {
      // response.render('income', {
      //   estudio: newEstudio,
      //   estudioId: newEstudio._id,
      //   members: newEstudio.familia.miembros.filter((m) => m.relacion != 'Estudiante'),
      // });
      console.log(newEstudio);
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
    console.log(data);
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
    Miembro.findOneAndDelete({_id: memberId})
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
    Miembro.find({ familyId: familyId })
    .then((allMembers) => {
      response.render('members', {members: allMembers});
    })
    .catch((error) => {
      console.log(error);
    })      
  },  
}