const periodController = require('./period');
const transactionController = require('./transaction');
const familyController = require('./family');
module.exports = {
  /**
  * This function returns a a created family
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createIncome: function (request, response) {
  	//retrieve data from form
  	const data = request.body;
  	console.log(data);
  	//create Period
  	let newPeriod = periodController.createPeriod(data.period);
  	// console.log(newPeriod);
  	//create transaction
  	let newTransaction = transactionController.createTransaction(data, newPeriod);
  	console.log(newTransaction);
  	//check to whom to add the transaction, to a member or a family
  	//add to member
  	if (data.tutor) {
  		familyController.addIncomeMember(newTransaction, request, response);
  	}
  	//add to family
  	else {
  		familyController.addIncomeFamily(newTransaction, request, response);
  	} 
  },
};