// const Familia  = require('../models/familia');
// const Miembro = require('../models/miembro');
// const Tutor = require('../models/tutor');
// const Estudio = require('../models/estudio');
const Escuela = require('../models/escuela');

module.exports = {
  /**
  * This function returns a a created School
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createSchool: function(data) {
    return Escuela.create({
      apiId: data.id,
      nombre: data.nombre,
    });
  },
  saveSchool: function(data) {
    let createdSchools = [];
    data.map((s) => {
      createdSchools.push(this.createSchool(s));
    });
    let mySavedSchools = [];
    createdSchools.map((i) => {
      let p = new Promise((resolve, reject) => {
        resolve(i.save())
      })
      mySavedSchools.push(p);
    });
    return Promise.all(mySavedSchools);
  },
}