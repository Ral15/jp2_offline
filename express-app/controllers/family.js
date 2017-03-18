const Familia  = require('../models/family');
const Miembro = require('../models/member');
const Tutor = require('../models/tutor');
const Estudiante = require('../models/student');

module.exports = {
  /**
  * This function checks if user exists in database, if there is
  * no record of the user, it will check with the API (only if there is internet
  * connection).
  * IF request OK dashboard view will be rendered.
  * IF NOT error message will be shown.
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  createFamily: function (request, response) {
    //get all data from POST
    const data = request.body;
    // console.log(data);
    const newData = this.parseData(data);
    // console.log(newData);
    //create members of the family
    let family = Familia.create();
    newData.map((m) => {
      if (m.role == 'estudiante') family.miembros.push(this.addStudent(m));
      else if (m.role == '') family.miembros.push(this.addMember(m));
      else family.miembros.push(this.addTutor(m));
    });
    //family
    console.log(family);
    family.save().then((f) => {
      console.log(f);
    });
  },
  /**
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
  * This function adds a Student Member to a Family
  * 
  * 
  * @event
  * @param {object} data - data of the member
  */
  addStudent: function(data) {
    return Estudiante.create({
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      //missing spei field*****
      spei: 10 
    });
  },
  /**
  * This function adds a Tutor member 
  * no record of the user, it will check with the API (only if there is internet
  * connection).
  * IF request OK dashboard view will be rendered.
  * IF NOT error message will be shown.
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */ 
  addTutor: function(data) {
    return Tutor.create({
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      relacion: data.role      
    });
  },
  /**
  * This function checks if user exists in database, if there is
  * no record of the user, it will check with the API (only if there is internet
  * connection).
  * IF request OK dashboard view will be rendered.
  * IF NOT error message will be shown.
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  addMember: function(data) {
    return Miembro.create({
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
    });
  }

}