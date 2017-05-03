const Miembro = require('../models/miembro');
const periodController = require('./period');
const transactionController = require('./transaction');

module.exports = { 
  /**
  * This function creates a Transaction as an Income
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createOutcome: function (request, response) {
    //retrieve data from form
    const data = request.body;
    data.type = '';
    //create Period
    let newPeriod = periodController.createPeriod(data.period);
    const familyId = request.session.familyId;
    //create transaction
    let newTransaction = transactionController.createTransaction(data, false, newPeriod, null, familyId);
    newTransaction.save()
    .then((t) => {
      return transactionController.showTransactionView(request, response);
    })
    .catch((err) => {
      console.log(err);
    })
  },  
  /**
  * This function editas a Transaction as an Income
  * 
  * @event
  * @param {object} request - request from POST
  * @param {object} response - response from POST
  */  
  editOutcome: function(request, response) {
    const data = request.body;
    data.type = '';
    let newPeriod = periodController.editPeriod(data.period);
    const familyId = request.session.familyId;
    const transactionId = request.params.id;
    let editedTransaction = transactionController.editTransaction(data, false, newPeriod, null, familyId, transactionId);
    editedTransaction.then((nT) => {
      // console.log(nT);
      return transactionController.showTransactionView(request, response)
    })
    .catch((err) => {
      console.log(err);
    })
  },
};