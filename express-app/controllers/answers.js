const Respuesta = require('../models/respuesta');

module.exports = {
  /**
  * This function changes the status of a Estudio to 'Eliminado'
  * using the id of the estudio
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
          response.sendStatus(200);
        });
      }
    });
  },
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
        response.sendStatus(200);
      }).catch((err) => {
        console.log(err);
        response.sendStatus(500);
      });

    });
  },
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
        console.log(e);
        return response.sendStatus(500);
      });
    }).catch((err) => {
      console.log(e);
      return response.sendStatus(500);
    });
  },
  uploadEstudio: function(request, response){
    req.post(
      urls.apiUrl + urls.api.uploadEstudio + request.params.id,
      {
        headers: {
          'Authorization': 'Token ' + request.session.apiToken,
        },

      },
      function (error, httpResponse, body) {
        if (httpResponse.statusCode > 201) {
          response.render('dashboard', { error_message: 'No se obtuvo la información' });
        } else {
          console.log(body)
        }
      });
  }
 }