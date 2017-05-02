const Respuesta = require('../models/respuesta');

module.exports = {
  /**
  * This controller receives a post from a section and creates an answer based on that post
  * if the answer is already created it will be updated
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  addAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idSeccion = Number(request.body.id_seccion);
    let aIndex = Number(request.body.index);
    let idEstudio = request.body.id_estudio;
    let valorRespuesta = request.body.answer;
    Respuesta.find({
      idEstudio: idEstudio,
      idPregunta: idPregunta 
    }, {
      sort: 'orden'
    }).then((respuestas) => {
      let create = false;
      if(respuestas.length > 0){
        if(aIndex >= respuestas.length){
          aIndex = respuestas.length;
          create = true;
        } else {
          Respuesta.findOneAndUpdate({
            idEstudio: idEstudio,
            idPregunta: idPregunta,
            orden: aIndex
          },{
            respuesta: valorRespuesta
          }).then((respuesta) => {
            return response.sendStatus(200);
          })
          .catch((e) => {
            console.log(e);
            return response.sendStatus(500);
          });
        }
      }else{
        create = true;
      }
      if(create){ 
        let respuesta = Respuesta.create({
          idEstudio: idEstudio,
          idPregunta: idPregunta,
          idSeccion: idSeccion,
          orden: aIndex,
          eleccion: null,
          respuesta: valorRespuesta
        });
        respuesta.save().then((resp) => {
          return response.sendStatus(200);
        })
        .catch((e) => {
          console.log(e);
          return response.sendStatus(500);
        });;
      }
    })
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
    });
  },
  /**
  * This controller receives a post from a section and creates a select answer based on that post
  * if the answer is already created it will be updated
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  addSelectAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idSeccion = Number(request.body.id_seccion);
    let valorRespuesta = Number(request.body.answer);
    let idEstudio = request.body.id_estudio;
    Respuesta.findOne({
      idEstudio: idEstudio,
      idPregunta: idPregunta 
    }).then((respuesta) => {
      if(respuesta){
        respuesta.eleccion = valorRespuesta;
      } else {
        respuesta = Respuesta.create({
          idEstudio: idEstudio,
          idPregunta: idPregunta,
          idSeccion: idSeccion,
          eleccion: valorRespuesta,
          respuesta: null
        });
      }
      respuesta.save().then((resp) => {
        return response.sendStatus(200);
      }).catch((err) => {
        console.log(err);
        return response.sendStatus(500);
      });

    })
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
    });;
  },
  /**
  * This controller receives a post from a section and delete an answer based on that post
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  removeAnswer: function(request, response){
    let idPregunta = Number(request.body.id_pregunta);
    let idEstudio = request.body.id_estudio;
    Respuesta.find({
      idEstudio: idEstudio,
      idPregunta: idPregunta 
    }, {
      sort: 'orden'
    }).then((respuestas) => {
      respuestas[respuestas.length - 1].delete().then((complete) => {
        return response.sendStatus(200);
      }).catch((err) => {
        console.log(err);
        return response.sendStatus(500);
      });
    }).catch((err) => {
      console.log(err);
      return response.sendStatus(500);
    });
  },
  /**
  * This controller receives a post from a section and creates an array of every answer related
  * to an estudio in order to send it to the api
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  serialize: function(idEstudio){
    return Respuesta.find({
      idEstudio: idEstudio
    }).then((respuestas) => {
      let series = [];
      for(let i = 0; i < respuestas.length; i++){
        let res = {};
        res.pregunta = respuestas[i].idPregunta;
        if(respuestas[i].respuesta){
          res.respuesta = respuestas[i].respuesta;
          res.eleccion = null;
          series.push(res);
        } else if (respuestas[i].eleccion) {
          res.respuesta = '';
          res.eleccion = respuestas[i].eleccion;
          series.push(res);
        }
      }
      return series;
    }).catch((err) => {
      console.log(err);
      return [];
    });;
  }
 }