"use strict";

//EmbeddedDocument class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
//extra models
const Periodo = require('./periodo.js');

const optionChoices = [
  '',
  'No comprobable',
  'Comprobable'
];

/*
 * Transaction of a family
 * 
 * Attributes:
 * ---------------
 * isActivo: BOOLEAN
 *    This attribute tells if the transaction is active or not
 * monto: NUMBER
 *    This attribute stores the amount of money of the transaction
 * periocidad: Perido
 *    This attribute is the relation with a Periodo
 * observacion: STRING
 *    This attribute tells more information about a transaction
 * isIngreso: BOOLEAN
 *    This attrinute determines if a transaccion is an Income or an Outcome
 */
class Transaccion extends EmbeddedDocument {
  constructor() {
    super();

    this.isActivo = {
      type: Boolean,
      default: true
    };
    this.monto = {
      type: Number,
      default: 0
    };
    this.periocidad = Periodo;
    this.observacion = {
      type: String,
      default: '',
      required: true
    };
    this.isIngreso = {
      type: Boolean
    };

    this.fecha = {
      type: Date,
    };

    this.tipo = {
      type: String,
      choices: optionChoices,
    }
  } 
  /**
   * This function calculates the monthly value of the transaction.
   *
  **/ 
  monthlyValue() {
    // if it is not an Ingreso then make it negative
    let value = this.isIngreso ? this.monto : this.monto * -1.0;
    if (this.periocidad.multiplica) {
      return value  * this.periocidad.factor;
    }
    else {
      return value / this.periocidad.factor;
    }
  }

  static collectionName() {
    return 'Transacciones';
  }
}

module.exports = Transaccion;