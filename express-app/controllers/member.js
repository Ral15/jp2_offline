const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
const Estudio = require('../models/estudio');
const Estudiante = require('../models/estudiante');

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
    const familyId = request.session.familyId;
    //create member object
    let myMember = this.createMember(data, familyId);
    //save member
    myMember.save()
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
    //get family id from session
    const familyId = request.session.familyId;
    //get member Id from query
    const memberId = request.params.id;
    //call promise that will update the info of the member
    let myMember = this.editMemberInfo(data, memberId);
    //resolve promise
    myMember.then((newMember) => {
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