const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
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
      localidad: data.location
    });
  },
  /**
  * This function returns a an object with the
  * information of a new family, it has to be an object
  * because of an issue with camo.
  * https://github.com/scottwrobinson/camo/issues/81
  *
  * @event
  * @param {object} data - data from the form
  * @param {string} id - id from the family to update
  */
  editFamily: function(data, id) {
    return {
      bastardos: Number(data.bastards),
      estadoCivil: data.martialStatus,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode),
      localidad: data.location
    };
  },
  /**
  * This function creates a member in the family model.
  * Data obtained from the form is parsed, then it creates
  * the member with the role specified.
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object.
  */
  createMembers: function (request, response) {
    //get all data from POST
    const data = request.body;
    // console.log(data);
    const newData = this.parseData(data);
    console.log(newData);
    //create members of the family
    let family = Familia.create();
    newData.map((m) => {
      console.log(m);
      if (m.role == 'estudiante') family.miembros.push(this.addStudent(m));
      else if (m.role == '') family.miembros.push(this.addMember(m));
      else family.miembros.push(this.addTutor(m));
    });
    //family
    family.save().then((f) => {
      console.log('es de fam');
      console.log(f);
    }).catch((err) => {
      console.log(err);
      response.render('error', { msg: 'No se pudieron registrar los miembros' });
    })
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
      //missing sae field*****
      sae: '10'
    });
  },
  /**
  * This function adds a Tutor member to a family
  *
  * @event
  * @param {object} data - data of the memeber
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
  * This function adds a Member to a Family
  *
  *
  * @event
  * @param {object} data - data of the memeber
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
