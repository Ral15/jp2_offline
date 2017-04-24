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
      return this.showIncomeView(request, response);
    })
    .catch((err) => {
      console.log(err);
    })
  },  
};