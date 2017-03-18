const Estudio = require('../models/estudio');


module.exports = {
  /**
  * This function creates a Estudio with te apiToken of the capturista,
  * then it shows the first step for filling a Estudio
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */    
  createEstudio: function(request, response) {
    //retrieve token from params
    let token = request.params.token;
    //create estudio
    let estudio = Estudio.create({
      tokenCapturista: token
    });
    //save estudio
    estudio.save().then((newEstudio) => {
      response.render('familia', {userToken: token, estudio: newEstudio});      
    });
  }
}