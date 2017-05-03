const Transaccion = require('../models/transaccion');
const Miembro = require('../models/miembro');
const periodController = require('./period');
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

    return myIncomes.then((i) => {
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
        members: allMembers.filter((m) =>  m.relacion == 'tutor' || m.relacion == 'madre' || m.relacion == 'padre'),
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
  },
  //remove familuyID??
  addAPIId: function(transactions, familyId) {
    let transactionsSaved = [];
    transactions.map((i) => {
      let p = periodController.addAPIId(i.periodicidad);
      let t = new Promise((resolve, reject) => {
        resolve(Transaccion.findOneAndUpdate({_id: i.offline_id}, 
          {
            apiId: i.id,
            // fecha: i.fecha,
            // tipoId: i.tipoId,
            // tipo: i.tipo,
            isActivo: i.activo,
            monto: i.monto,
            periocidad: p,
            observacion: i.observacion,
            isIngreso: i.es_ingreso,
            valorMensual: this.monthlyValue(i.es_ingreso, i.monto, p.multiplica, p.factor)
          }));
      });
      transactionsSaved.push(t);
    });
    return Promise.all(transactionsSaved); 
  },
  updateTransactionFromAPI: function(transactions, familyId) {
    let transactionsSaved = [];
    transactions.map((i) => {
      let p = periodController.addAPIId(i.periodicidad);
      let t = new Promise((resolve, reject) => {
        resolve(Transaccion.findOneAndUpdate(
          {
            apiId: i.id,
          }, 
          {
            familyId: familyId,
            apiId: i.id,
            // fecha: i.fecha,
            // tipoId: i.tipoId,
            // tipo: i.tipo,
            isActivo: i.activo,
            monto: i.monto,
            periocidad: p,
            observacion: i.observacion,
            isIngreso: i.es_ingreso,
            valorMensual: this.monthlyValue(i.es_ingreso, i.monto, p.multiplica, p.factor)
          },
          {upsert: true}));
      });
      transactionsSaved.push(t);
    });
    return Promise.all(transactionsSaved); 
  },

  /**
  * This functions parses all incomes and outcomes from a family
  *
  * @event
  * @param {string} familyId - id of the 
  * @param {array} incomes - array with all incomes
  * @param {array} outcomes - array with all outcomes
  */  
  formatTransactions: function(familyId, incomes, outcomes) {
    let allIncomes = incomes.map((i) => {
      return {
        activo: true,
        monto: i.monto,
        periodicidad: {
          periodicidad: i.periocidad.periodicidad,
          factor: i.periocidad.factor,
          multiplica: i.periocidad.multiplica,
        },
        observacion: i.observacion,
        es_ingreso: true,
        offline_id: i._id
      }
    });
    let allOutcomes = outcomes.map((e) => {
      return {
        activo: true,
        monto: e.monto,
        periodicidad: {
          periodicidad: e.periocidad.periodicidad,
          factor: e.periocidad.factor,
          multiplica: e.periocidad.multiplica,
        },
        observacion: e.observacion,
        es_ingreso: false,
        offline_id: e._id
      }
    });
    let all = allIncomes.concat(allOutcomes);
    return all;
  },  
};