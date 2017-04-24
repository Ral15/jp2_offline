const Miembro = require('../models/miembro');
const periodController = require('./period');
const transactionController = require('./transaction');

module.exports = {
  /**
  * This function returns the income view with the members
  * 
  * @event
  * @param {object} data - data from the form
  */   
  showIncomeView: function(request, response) {
    //obtain familyId
    const familyId = request.session.familyId;
    //obtain incomes amount
    const obtainIncomesAmount = transactionController.getTransactionsAmount(familyId, true);
    const obtainOutcomesAmount = transactionController.getTransactionsAmount(familyId, false);
    const myIncomes = transactionController.getTransactions(familyId, true);
    const myOutcomes = transactionController.getTransactions(familyId, false);
    //context variables
    let totalIncome;
    let totalOutcome;
    let incomes;
    let outcomes;

    myIncomes.then((i) => {
      incomes = i;
      return myOutcomes;
    })
    .then((o) => {
      outcomes = o;
      return obtainIncomesAmount;
    })
    .then((tI) => {
      totalIncome = tI;
      return obtainOutcomesAmount;
    })
    .then((tO) => {
      totalOutcome = tO;
      return Miembro.find({familyId: familyId});
    })
    .then((allMembers) => {
      return response.render('income', {
        members: allMembers.filter((m) =>  m.relacion != 'estudiante' ),
        incomes: incomes,
        outcomes: outcomes,
        incomeAmount: totalIncome,
        outcomeAmount: totalOutcome,
        status: totalIncome - totalOutcome,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  },
  /**
  * This function returns a a created family
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createIncome: function (request, response) {
  	//retrieve data from form
  	const data = request.body;
  	// console.log(data);
  	//create Period
  	let newPeriod = periodController.createPeriod(data.period);
  	// console.log(newPeriod);
    const familyId = request.session.familyId;
    const tutorValue = data.tutor.split("/");
    // console.log(data.tutor);
    // console.log(tutorValue);
    // return 1;
    const memberId = tutorValue[0];
    data.tutor = tutorValue[1];
  	//create transaction
  	let newTransaction = transactionController.createTransaction(data, true, newPeriod, memberId, familyId);
    newTransaction.save()
    .then((t) => {
      return this.showIncomeView(request, response);
    })
    .catch((err) => {
      console.log(err);
    })
  },
};