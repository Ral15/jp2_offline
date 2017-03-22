const Familia  = require('../models/familia');
const Miembro = require('../models/miembro');
const Tutor = require('../models/tutor');
const Estudiante = require('../models/estudiante');

module.exports = {
  /**
  * This function returns a Resolved Promise that 
  * creates a family
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createFamily: function(data) {
    // create family
    let family = Familia.create({
      bastardos: Number(data.bastards),
      estadoCivil: data.martialStatus,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode),
      localidad: data.location
    }).save()
    .then((f) => {
      return f;
    })
    .catch((err) => {
      console.log(err);
    });
    return Promise.resolve(family);
  },
  /**
  * This function returns a Resolved Promise that 
  * edits a family
  * 
  * @event
  * @param {object} data - data from the form
  * @param {string} id - id from the family to update
  */  
  editFamily: function(data, id) {
    let family = Familia.findOneAndUpdate({ _id: id },
      {
        bastardos: Number(data.bastards),
        estadoCivil: data.martialStatus,
        calle: data.street,
        colonia: data.street2,
        codigoPostal: Number(data.zipCode),
        localidad: data.location        
      }
    )
    .then((editedFamily) => {
      return editedFamily;
    })
    .catch((err) => {
      console.log(err);
    });
    return Promise.resolve(family);
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
    // console.log(newData);
    //create members of the family
    let family = Familia.create();
    newData.map((m) => {
      if (m.role == 'estudiante') family.miembros.push(this.addStudent(m));
      else if (m.role == '') family.miembros.push(this.addMember(m));
      else family.miembros.push(this.addTutor(m));
    });
    //family
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