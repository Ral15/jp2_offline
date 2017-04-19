const Transaccion = require('../models/transaccion');

module.exports = {
  /**
  * This function returns a a created family
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createTransaction: function (data, newPeriod) {
  	return Transaccion.create({
      monto: Number(data.amount),
      periocidad: newPeriod,
      observacion: data.observations,
      isIngreso: true,
      tipo: data.type,
      fecha: data.dateReceived,
    });
  },
};