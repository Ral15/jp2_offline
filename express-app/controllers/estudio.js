const Estudio = require('../models/estudio');
const Familia = require('../models/familia');
const Miembro = require('../models/miembro');
const Transaccion = require('../models/transaccion');
const familyController = require('./family');
const memberController = require('./member');
const transactionsController = require('./transaction');


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
    response.locals.estudioActive = 'family';
    console.log(estudioId);
    if (estudioId) {
      request.session.estudioId = estudioId;
      response.locals.estudioId = request.session.estudioId;
      Estudio.findOne({
        _id: estudioId
      })
      .then((myEstudio) => {
        //set session variables
        request.session.estudioAPIId = myEstudio.apiId;
        request.session.familyId = myEstudio.familia._id;
        request.session.max_step = myEstudio.maxStep;
        response.locals.max_step = request.session.max_step;
        this.isEstudioValid(request.session.familyId).then((value) => {
          console.log('soy el value => ' + value);
          console.log('soy el EstudioapiID: '+ request.session.estudioAPIId);
          // request.session.isValid = value;
          response.locals.isValid = value;
          // console.log(myEstudio.familia);
          return response.render('family',  {
            family: myEstudio.familia
          });
        })
        // return 1;
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
    const token = request.session.user.apiToken;
    //get data from request
    const data = request.body;
    //create familia
    let newFamily = familyController.createFamily(data);
    let estudioId = '';
    let familyId = '';
    //save familia
    newFamily.save()
    .then((newFamily) => {
      //create estudio
      let estudio = Estudio.create({
        tokenCapturista: token,
        familia: newFamily
      });
      //save estudio
      return estudio.save();
    })
    .then((newEstudio) => {
      request.session.estudioAPIId = -1;
      request.session.estudioId = newEstudio._id;
      response.locals.estudioId = request.session.estudioId;
      request.session.familyId = newEstudio.familia._id;
      request.session.max_step = newEstudio.maxStep;
      response.locals.max_step = request.session.max_step
      return memberController.showMemberView(request, response);
    })
    .catch((error) => {
      //estudio could not be created
      console.log(error);
    });
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
    //store estudioId in session
    request.session.estudioId = request.query.estudioId;
    const estudioId = request.session.estudioId;
    //get user token from session
    const token = request.session.user.apiToken;
    const data = request.body;
    let familyId;
    //get object with the new values for a family
    Estudio.findOne({_id: estudioId})
    .then((currEstudio) => {
      //save familyId at session
      familyId = currEstudio.familia._id;
      request.session.familyId = familyId;
      //create object with the new family data
      let editedFamily = familyController.editFamily(data, familyId);
      return editedFamily;
    })
    .then((editedFamily) => {
      //find and update estudio
      return Estudio.findOneAndUpdate({_id: estudioId}, 
      {
        familia: editedFamily
      });
    })
    .then((editedEstudio) => {
      //get all members
      return memberController.showMemberView(request, response);
    })
    .catch((error) => {
      //estudio not edited
      console.log(error);
    });
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
    Estudio.findOneAndUpdate({
      _id: estudioId
    },
    {
      status: 'Eliminado'
    })
    .then((myEstudio) => {
        return response.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      return response.sendStatus(500);
    });
  },
  /**
  * This function returns the Estudios with the status desired
  * 
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  getEstudios: function(request, response) {
    let myStatus = request.query.status;
    let user = request.session.user;
    Estudio.find({
      tokenCapturista: user.apiToken,
      status: myStatus
    })
    .then((e) => {
      console.log(e)
      response.render('dashboard', { 
        estudios: e, 
        active: myStatus 
      });
    })
    .catch((err) => {
      console.log(e);
    })
  },
  /**
  * This function returns the update promise of the Estudio
  * 
  * 
  * @event
  * @param {number} apiId - apiId to add  
  * @param {string} estudioId - estudioId to update
  */    
  addAPIId: function(apiId, estudioId) {
    return Estudio.findOneAndUpdate({
      _id: estudioId
    },
    {
      apiId: apiId,
      status: 'Revisión',
    });
  },
  /**
  * This should be called at the init of an estudio and at the upload
  * This functions validates if an estudio can be uploades. It needs:
  * 1 family
  * 2 Members, 1 student 1 tutor
  * 2 Transactions, 1 income 1 outcome
  * TODO: 1 img from Vivienda
  * It will return true if everything is OK
  * 
  * @event
  * @param {number} apiId - apiId to add  
  * @param {string} estudioId - estudioId to update
  */      
  isEstudioValid: function(familyId) {
    //set variables that will hold count value
    let tutorsCount = 0;
    let studentsCount = 0;
    let incomeCount = 0;
    let outcomeCount = 0;
    //find all members
    return Miembro.find({familyId: familyId})
    .then((members) => {
      //iterate through all members and add to counter depending on the role
      members.map((m) => {
        if (m.relacion == 'madre' || m.relacion == 'padre' || m.relacion == 'tutor' )  {
          tutorsCount ++;
        }
        else if (m.relacion == 'estudiante') {
          studentsCount ++;
        }
      });
      //get incomes
      return Transaccion.count({familyId: familyId, isIngreso: true});
    })
    .then((i) => {
      incomeCount += i;
      //get outcomes
      return Transaccion.count({familyId: familyId, isIngreso: false});
    })
    .then((o) => {
      outcomeCount += o;
      //check the restriction
      if (studentsCount >= 1 && tutorsCount >= 1 && 
          incomeCount >= 1 && outcomeCount >= 1) {
        return true;
      }
      else return false;
    })
    .catch((err) => {
      console.log(err);
    });
  },
  showUploadView: function(request, response) {
    response.locals.estudioActive = 'upload';
    return response.render('uploadEstudio');
  }
 }