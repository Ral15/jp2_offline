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
  /**
  * This function editas a Transaction as an Income
  * 
  * @event
  * @param {object} request - request from POST
  * @param {object} response - response from POST
  */  
  editIncome: function(request, response) {
    const data = request.body;
    let newPeriod = periodController.editPeriod(data.period);
    const familyId = request.session.familyId;
    const tutorValue = data.tutor.split("/");
    const memberId = tutorValue[0];
    data.tutor = tutorValue[1];
    const transactionId = request.params.id;
    let editedTransaction = transactionController.editTransaction(data, true, newPeriod, null, familyId, transactionId);
    editedTransaction.then((nT) => {
      return transactionController.showTransactionView(request, response)
    })
    .catch((err) => {
      console.log(err);
    })
  },
  /**
  * This functions parses all incomes associated to a tutor
  *
  * @event
  * @param {array} incomes - array with all incomes from a family
  * @param {string} id - id of tutor
  */    
  formatIncomesTutors: function(incomes, miembroId) {
    //filter incomes of the member
    let formatIncome = incomes.filter((i) => {
      return i.miembroId == miembroId;
    }).map((i) => { //map through all filtered incomes
      return {
          fecha: i.fecha,
          tipo: i.tipo,
          transaccion: {
            activo: i.isActivo,
            monto: i.monto,
            periodicidad: {
              periodicidad: i.periocidad.periodicidad,
              factor: i.periocidad.factor,
              multiplica: i.periocidad.multiplica,
            },
            observacion: i.observacion,
            es_ingreso: true,
            offline_id: i._id
          },
          offline_id: miembroId,
        }
    });
    return formatIncome;
  },  
};