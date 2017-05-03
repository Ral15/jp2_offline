const Periodo = require('../models/periodo');

//options for values 
const options = {
  Diario: { factor: 30 , multiply: true },
  Semanal: { factor: 4.3, multiply: true },
  Quincenal: { factor: 2, multiply: true} ,
  Mensual: { factor: 1, multiply: true },
  Bimestral: { factor: 2, multiply: false },
  Trimestral: { factor: 3, multiply: false },
  Cuatrimestral: { factor: 4, multiply: false },
  Semestral: { factor: 6, multiply: false },
  Anual: { factor: 12, multiply: false },
};

module.exports = {
  /**
  * This function returns an edited period
  * 
  * @event
  * @param {object} data - data from the form
  */   
  createPeriod: function (period) {
  	return Periodo.create({
      periodicidad: period,
      factor: options[period].factor,
      multiplica: options[period].multiply,
    });
  },
  /**
  * This function returns a an edited period
  * 
  * @event
  * @param {object} data - data from the form
  */     
  editPeriod: function(period) {
    return {
      periodicidad: period,
      factor: options[period].factor,
      multiplica: options[period].multiply,
    }
  },
  /**
  * This function returns an edited period with API data.
  * 
  * @event
  * @param {object} data - data from the form
  */     
  addAPIId: function(data) {
    return {
      apiId: data.id,
      periodicidad: data.periodicidad,
      factor: options[data.periodicidad].factor,
      multiplica: options[data.periodicidad].multiply,
    }
  },
};