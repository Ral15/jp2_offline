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
  createIncome: function (request, response) {
  	//retrieve data from form
  	const data = request.body;
  	//create Period
  	let newPeriod = periodController.createPeriod(data.period);
    const familyId = request.session.familyId;
    const tutorValue = data.tutor.split("/");
    const memberId = tutorValue[0];
    data.tutor = tutorValue[1];
  	//create transaction
  	let newTransaction = transactionController.createTransaction(data, true, newPeriod, memberId, familyId);
    newTransaction.save()
    .then((t) => {
      return transactionController.showTransactionView(request, response);
    })
    .catch((err) => {
      console.log(err);
    })
  },
};