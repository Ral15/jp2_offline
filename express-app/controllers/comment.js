const rp = require('request-promise');
const urls = require('../routes/urls');
const Comentario = require('../models/comentario');
const estudioController = require('./estudio');


module.exports = {
  /**
  * This function returns a a created School
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createComment: function(comment, estudioId) {
    return Comentario.create({
      estudioId: estudioId,
      texto: comment
    });
  },
  /**
  * This function saves a created Job
  * 
  * @event
  * @param {object} data - data from the form
  */   
  saveComment: function(request,response ) {
    let comment = request.body.comment;
    let myComment = this.createComment(comment, request.session.estudioId);
    myComment.save()
    .then((e) => {
      console.log(e);
      response.redirect('/upload/');
    })
    .catch((e) => {
      console.log(e);
    });
  },
  /**
  * This functions makes a GET to obtain all the Jobs
  *
  * @event
  * @param {string} userApiToken - user api token 
  */   
  getComments: function(estudioId) {
    return Comentario.find({ estudioId: estudioId });
  }, 
  /**
  * This functions returns the formatted comments
  *
  * @event
  * @param {string} userApiToken - user api token 
  */   
  formatComments: function(comments) {
    return comments.map((c) => {
      return {
        fecha: c.fecha,
        texto: c.texto
      };
    });
  },
  addAPIId: function(comments) {
    let savedComments = [];
    comments.map((c) => {
      let p = new Promise((resolve, reject) => {
        //TODO: add offline_id in API
        resolve(Comentario.findOneAndUpdate({texto: c.texto}, {
          apiId: c.id
        }));
      });
      savedComments.push(p);
    });
    return Promise.all(savedComments);
  },
}