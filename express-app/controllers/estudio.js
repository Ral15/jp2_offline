const Estudio = require('../models/estudio');


module.exports = {
  /**
  * This function creates a Estudio with te apiToken of the capturista,
  * and the address of the family,
  * then it shows the first step for filling a Estudio
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */    
  createEstudio: function(request, response) {
    //retrieve token from params
    let token = request.session.apiToken;
    //get data from request
    const data = request.body;
    // create estudio
    let estudio = Estudio.create({
      tokenCapturista: token,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode)
    });
    //save estudio
    estudio.save()
    .then((newEstudio) => {
      console.log(newEstudio);
      response.render('familia', {userToken: token, estudio: newEstudio});      
    })
    .catch((error) => {
      console.log(error);
    })
  }
}