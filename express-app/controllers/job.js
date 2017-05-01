// const rp = require('request-promise');
// const urls = require('../routes/urls');
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
//   /**
//   * This function saves a created Job
//   * 
//   * @event
//   * @param {object} data - data from the form
//   */   
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
//   /**
//   * This functions makes a GET to obtain all the Jobs
//   *
//   * @event
//   * @param {string} userApiToken - user api token 
//   */   
//   getJobs: function(userApiToken) {
//     let options = {
//       uri: urls.apiUrl + urls.api.jobs,
//       headers: {
//           'Authorization': 'Token ' + userApiToken,
//       },
//       json: true
//     };
//     return rp(options)
//       .then((data) => {
//         let jobs = jobsController.saveJobs(data);
//         return jobs;
//       })
//       .then((j) => {
//         return j;
//       })
//       .catch((err) => {
//         console.log(err);
//       });    
//   },  
// }