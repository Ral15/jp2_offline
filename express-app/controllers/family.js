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
      miembro: [],
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
      miembros: data.members,
      comentarios: data.comments,
      transacciones: data.transactions,
    });
  },
  // editMembers: function()
  /**
  * This function creates a member in the family model.
  * Data obtained from the form is parsed, then it creates 
  * the member with the role specified.
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  editMembers: function (request, response) {
    //get all data from POST
    const data = request.body;
    //get estudioId
    const estudioId = request.query.estudioId;
    //get member Id
    const memberId = request.query.memberId;
    // const newData = this.parseData(data);
    let myMember = this.addMember(data);
    console.log(myMember);
    let newMember  = [];
    myMember.save()
    .then((m) => {
      console.log(m);
      return 1;
      newMember.push(m);
      return Estudio.findOne({ _id: estudioId });
    })
    .then((currEstudio) => {
      const newFamily = {
        calle: currEstudio.familia.calle,
        colonia: currEstudio.familia.colonia,
        bastardos: currEstudio.familia.bastardos,
        estadoCivil: currEstudio.familia.estadoCivil,
        codigoPostal: currEstudio.familia.codigoPostal,
        localidad: currEstudio.familia.localidad,
        miembros: currEstudio.familia.miembros.push(newMember),
      };      
      return Estudio.findOneAndUpdate({_id: estudioId}, {familia: newFamily}); 
    })
    .then((newEstudio) => {
      console.log(newEstudio);
      response.render('income', {
        estudio: newEstudio,
        estudioId: newEstudio._id,
        // members: newEstudio.familia.miembros.filter((m) => m.relacion != 'Estudiante'),
      });
    })
    .catch((err) => {
      console.log(err);
    });
    // return 1;
    // //create members of the family
    // let familyMiembros = [];
    // newData.map((m) => {
    //   familyMiembros.push(this.addMember(m));
    // });
    // //find estudio
    // Estudio.findOne({
    //   _id: estudioId
    // })
    // .then((currEstudio) => {
    //   console.log(currEstudio.familia.miembros);
    //   const newFamily = {
    //     calle: currEstudio.familia.calle,
    //     colonia: currEstudio.familia.colonia,
    //     bastardos: currEstudio.familia.bastardos,
    //     estadoCivil: currEstudio.familia.estadoCivil,
    //     codigoPostal: currEstudio.familia.codigoPostal,
    //     localidad: currEstudio.familia.localidad,
    //     miembros: familyMiembros,
    //   };
    //   return Estudio.findOneAndUpdate({_id: estudioId}, {familia: newFamily});
    // })
    // .then((newEstudio) => {
    //   response.render('income', {
    //     estudio: newEstudio,
    //     estudioId: newEstudio._id,
    //     members: newEstudio.familia.miembros.filter((m) => m.relacion != 'Estudiante'),
    //   });
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
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
  ******************DEPRECATED**************************
  * This function adds a Student Member to a Family
  * 
  * 
  * @event
  * @param {object} data - data of the member
  *****************************************************
  */
  addStudent: function(data) {
    // return Estudiante.create({
    return {
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      //missing sae field*****
      sae: '10' 
    };
  },
  /**
  ****************DEPRECATED*********************  
  * This function adds a Tutor member to a family 
  * 
  * @event
  * @param {object} data - data of the memeber
  ************************************************
  */ 
  addTutor: function(data) {
    // return Tutor.create({
    return {
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      relacion: data.role      
    };
  },
  /**
  * This function adds a Member to a Family
  * 
  * 
  * @event
  * @param {object} data - data of the memeber 
  */   
  addMember: function(data) {
    // return Miembro.create({
    return Miembro.create({
      nombres: data.firstName,
      apellidos: data.lastName, 
      edad: data.age,
      nivelEstudios: data.academicDegree,
      fechaNacimiento: data.birthDate,
      telefono: data.phone,
      correo: data.email,
      relacion: data.role,
      sae: data.sae,
      escuela: data.school
    });
  },
  /**
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
}