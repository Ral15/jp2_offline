// // const Familia  = require('../models/familia');
// // const Miembro = require('../models/miembro');
// // const Tutor = require('../models/tutor');
// // const Estudio = require('../models/estudio');
// const Oficio = require('../models/oficio');

// module.exports = {
//   /**
//   * This function returns a a created School
//   * 
//   * @event
//   * @param {object} data - data from the form
//   */   
//   createJob: function(data) {
//     return Oficio.create({
//       apiId: data.id,
//       nombre: data.nombre,
//     });
//   },
//   saveJob: function(data) {
//     let createdJobs = [];
//     data.map((j) => {
//       createdJobs.push(this.createJob(j));
//     });
//     let mySavedJobs = [];
//     createdJobs.map((i) => {
//       let p = new Promise((resolve, reject) => {
//         resolve(i.save())
//       })
//       mySavedJobs.push(p);
//     });
//     return Promise.all(mySavedJobs);
//   },
// }