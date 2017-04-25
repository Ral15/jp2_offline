"use strict";

//EmbeddedDocument class from camo
var Document = require('camo').Document;
//extra models
const Periodo = require('./periodo.js');

const optionChoices = [
  '',
  'no comprobable',
  'comprobable'
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
class Transaccion extends Document {
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
      // required: true
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
      default: optionChoices[0],
    };

    this.miembroId = {
      type: String,
      default: '',
    };

    this.familyId = {
      type: String,
    };

    this.nombreMiembro = {
      type: String,
      default: '',
    };

    this.valorMensual = {
      type: Number,
    }
  } 

  static collectionName() {
    return 'Transacciones';
  }
}

module.exports = Transaccion;