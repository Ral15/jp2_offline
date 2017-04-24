const Transaccion = require('../models/transaccion');

module.exports = {
  /**
  * This function returns a a created family
  * 
  * @event
  * @param {object} data - data from the form
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
  getTransactions: function(familyId, isIncome) {
    return Transaccion.find({familyId: familyId, isIngreso: isIncome});
  },
  /****
  * This function returns all the incomes of a family and members
  * calculated by month
  * @event
  * @param {object} data - data from the form
  */   
  getTransactionsAmount: function(familyId, isIncome) {
    let totalAmount = 0;
    //get all transactions
    return Transaccion.find({familyId: familyId, isIngreso: isIncome})
    .then((allT) => {
      allT.forEach((t) => {
        console.log(t);
        totalAmount += t.valorMensual;
      });
      return totalAmount;
    })
    .catch((err) => {
      console.log(err);
    })
  },  
};
