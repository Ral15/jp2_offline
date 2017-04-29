const Transaccion = require('../models/transaccion');
const Miembro = require('../models/miembro');

module.exports = {
/**
  * This function returns the transaction view with the members
  * 
  * @event
  * @param {object} data - data from the form
  */   
  showTransactionView: function(request, response) {
    //obtain familyId
    const familyId = request.session.familyId;
    response.locals.estudioActive = 'transactions';
    //obtain incomes amount
    const obtainIncomesAmount = this.getTransactionsAmount(familyId, true);
    const obtainOutcomesAmount = this.getTransactionsAmount(familyId, false);
    const myIncomes = this.getTransactions(familyId, true);
    const myOutcomes = this.getTransactions(familyId, false);
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
      return response.render('transactions', {
        members: allMembers.filter((m) =>  m.relacion != 'estudiante' ),
        incomes: incomes,
        outcomes: outcomes,
        incomeAmount: totalIncome,
        outcomeAmount: totalOutcome,
        status: totalIncome + totalOutcome,
        estudioAPIId: request.session.estudioAPIId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  },  
  /**
  * This function returns a a created transaction
  * 
  * @event
  * @param {object} data - data from the form
  * @param {boolean} isIncome - boolean to tell if isIncome
  * @param {object} newPeriod - Period object from model
  * @param {string} memberId - id of the member
  * @param {string} familyId - id of the family
  *
  *
  */
  createTransaction: function (data, isIncome, newPeriod, memberId, familyId) {
  	return Transaccion.create({
      monto: Number(data.amount),
      periocidad: newPeriod,
      observacion: data.observations,
      isIngreso: isIncome,
      tipo: data.type,
      fecha: data.dateReceived,
      miembroId: memberId,
      familyId: familyId,
      nombreMiembro: data.tutor,
      valorMensual: this.monthlyValue(isIncome, Number(data.amount), newPeriod.multiplica, newPeriod.factor), 
    });
  },
  editTransaction: function (data, isIncome, newPeriod, memberId, familyId, transactionId) {
    // return Transaccion.find({_id: transactionId});
    return Transaccion.findOneAndUpdate({_id: transactionId},
      {
        monto: Number(data.amount),
        periocidad: newPeriod,
        observacion: data.observations,
        isIngreso: isIncome,
        tipo: data.type,
        fecha: data.dateReceived,
        miembroId: memberId,
        familyId: familyId,
        nombreMiembro: data.tutor,
        valorMensual: this.monthlyValue(isIncome, Number(data.amount), newPeriod.multiplica, newPeriod.factor), 
      });
  },  
  /**
   * This function calculates the monthly value of the transaction.
   *
  **/ 
  monthlyValue: function(isIncome, amount, isMultiply, factor) {
    // if it is not an Ingreso then make it negative
    let value = isIncome ? amount : amount * -1.0;
    if (isMultiply) {
      return value  * factor;
    }
    else {
      return value / factor;
    }
  },
/**
  * This function returns all the transactions
  * 
  * @event
  * @param {string} familyId - id of the family
  * @param {boolean} isIncome - boolean to decide what to retrieve(incomes or outcomes)
  *
  */
  getTransactions: function(familyId, isIncome) {
    return Transaccion.find({familyId: familyId, isIngreso: isIncome});
  },
  /**
  * This function returns all the incomes of a family and members
  * calculated by month
  *
  * @event
  * @param {object} data - data from the form
  *
  **/
  getTransactionsAmount: function(familyId, isIncome) {
    let totalAmount = 0;
    //get all transactions
    return Transaccion.find({familyId: familyId, isIngreso: isIncome})
    .then((allT) => {
      allT.forEach((t) => {
        // console.log(t);
        totalAmount += t.valorMensual;
      });
      return totalAmount;
    })
    .catch((err) => {
      console.log(err);
    })
  },
    /**
  * This function deletes a transaction by its id
  *
  * @event
  * @param {object} request - request object
  * @param {object} response - response object
  *
  *
  **/
  deleteTransaction: function(request, response) {
    //retrieve income id from request
    const transactionId = request.params.id;
    //*** delete function did not work, fuck you camo
    Transaccion.findOneAndDelete({_id: transactionId})
    .then(() => {
      return response.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return response.sendStatus(500);
    });
  }
};
