const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const familyController = require('./family');
module.exports = {
  /**
  * This function shows the family form, IF the url query is empty
  * then it means that the familia and estudio is created from scratch, IF NOT then
  * it means it is a estudio that is going to be updated.
  *
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */
  showFamilyForm: function(request, response) {
    //retrieve estudio id from url
    let estudioId = request.query.estudioId;
    if (estudioId) {
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        response.render('family',  {
          estudioId: myEstudio._id, 
          family: myEstudio.familia  
        });
      })
      .catch((error) => {
        //no estudio found
        console.log(error);
      })
    }
    else {
      response.render('family');
    }
  },  
  /**
  * This function creates a Estudio with te apiToken of the capturista,
  * and with a family,
  * then it shows the form to fill the members information.
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
    //create familia
    let family = familyController.createFamily(data);
    family
    .then((newFamily) => {
      //create estudio
      let estudio = Estudio.create({
        tokenCapturista: token,
        familia: newFamily
      });
      //save estudio
      estudio.save()
      .then((newEstudio) => {
        response.render('members', {
          userToken: token, 
          estudioId: newEstudio._id, 
          family: newFamily
        });      
      })
      .catch((error) => {
        //family could not be created
        console.log(error);
      })
    })
    .catch((err) => {
      //family could not be created
      console.log(err);
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
  editEstudio: function(request, response) {
    const estudioId = request.query.estudioId;
    const familyId = request.query.familyId;
    // return console.log(request.query);
    const token = request.session.apiToken;
    const data = request.body;
    let editedFamily = familyController.editFamily(data, familyId);
    editedFamily
    .then((newFamily) => {
      Estudio.findOneAndUpdate({ _id: estudioId },
        {
          familia: newFamily
        }
      )
      .then((editedEstudio) => {
        response.render('members', {
          userToken: token, 
          estudioId: editedEstudio._id,
          family: newFamily
        });      
      })
      .catch((error) => {
        //estudio not edited
        console.log(error);
      })
    })
    .catch((err) => {
      //family no edited
      console.log(err);
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
    //get id of estudio
    let estudioId = request.params.id;
    //find estudio
    Estudio.findOne({
      _id: estudioId
    })
    .then((myEstudio) => {
      //delete estudio
      myEstudio.delete()
      .then(() => {
        return response.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        return response.sendStatus(500);
      })
    })
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
    });
  }
 }