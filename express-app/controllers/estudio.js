const Estudio = require('../models/estudio');


module.exports = {
  /**
  * This function shows the address form, IF the url query is empty
  * then it means that the estudio is created from scratch, IF NOT then
  * it means it is a estudio that is going to be updated.
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  showAddressForm: function(request, response) {
    //retrieve estudio id from url
    let estudioId = request.query.estudioId;
    if (estudioId) {
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        response.render('address',  {estudio: myEstudio  });
      })
      .catch((error) => {
        //no estudio found
        this.createEstudio(request, response);
      })
    }
    else {
      response.render('address');
    }
  },  
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
    const token = request.session.apiToken;
    //get data from request
    const data = request.body;
    let estudio = Estudio.create({
      tokenCapturista: token,
      calle: data.street,
      colonia: data.street2,
      codigoPostal: Number(data.zipCode)
    });
    //save estudio
    estudio.save()
    .then((newEstudio) => {
      response.render('familia', {userToken: token, estudio: newEstudio});      
    })
    .catch((error) => {
      console.log(error);
    })
  },
  /**
  * This function edits the address of a Estudio previously created
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */      
  editAddressEstudio: function(request, response) {
    const estudioId = request.query.estudioId;
    const token = request.session.apiToken;
    const data = request.body;
    Estudio.findOneAndUpdate({ _id: estudioId },
      {
        calle: data.street,
        colonia: data.street2,
        codigoPostal: Number(data.zipCode)
      }
    )
    .then((editedEstudio) => {
      console.log(editedEstudio);
      response.render('familia', {userToken: token, estudio: editedEstudio});      
    })
    .catch((error) => {
      console.log(error);
    })
  },
  /**
  * This function changes the status of a Estudio to 'Eliminado'
  * using the id of the estudio
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */  
  deleteEstudio: function(request, response) {
    console.log(request.params.id);
    let estudioId = request.params.id;
    Estudio.findOneAndDelete({ 
      _id : estudioId
    })
    .then((deleted) => {
      return response.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return response.sendStatus(500);
    })
  }
 }