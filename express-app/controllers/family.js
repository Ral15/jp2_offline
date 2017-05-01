const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
const Estudio = require('../models/estudio');
const Estudiante = require('../models/estudiante');
const memberController = require('./member');

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
  * This function shows the family form
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  showFamilyView: function(request, response) {
    //retrieve estudio id from url
    response.locals.estudioActive = 'family';
    const familyId = request.session.familyId;
    Familia.findOne({_id: familyId})
    .then((myFamily) => {
      console.log(myFamily);
      response.render('family',  {
        family: myFamily,
      });
    })
    .catch((err) => {
      console.log(err);
    });
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
    let formatedTutors = memberController.formatTutores(tutors, incomes);
    //TODO:: formatStudents
    let formatedStudents = memberController.formatStudents(students, schools);
    return formatedTutors.concat(formatedStudents);
  },    
  /**
  * TODO: edit address values aswell
  *
  * This function adds the family apiID
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  addAPIId: function(data, familyId) {
    return Familia.findOneAndUpdate(
      {
        _id: familyId
      },
      {
        apiId: data.id,
        bastardos: data.numero_hijos_diferentes_papas,
        estadoCivil: data.estado_civil,
        // calle: data.street,
        // colonia: data.street2,
        // codigoPostal: Number(data.zipCode),
        localidad: data.localidad,
        nombreFamilia: data.nombre_familiar,
      });
  },
}