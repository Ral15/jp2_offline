const rp = require('request-promise');
const urls = require('../routes/urls');
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
  /**
  * This function saves a school
  * 
  * @event
  * @param {object} data - data from the form
  */   
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
  /**
  * This functions makes a GET to obtain all the Schools
  *
  * @event
  * @param {string} userApiToken - user api token 
  */  
  getSchools: function(userApiToken) {
    let options = {
      uri: urls.apiUrl + urls.api.schools,
      headers: {
          'Authorization': 'Token ' + userApiToken,
      },
      json: true
    };
    return rp(options)
      .then((data) => {
        let school = this.saveSchool(data);
        return school;
      })
      .then((s) => {
        return s;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getSchool: function(apiId) {
    return Escuela.findOne({apiId: apiId})
      .then((e) => {
        return e;
      })
      .catch((err) => {
        console.log(err);
      });
  },
}