"use strict";

const Transaccion = require('./transaccion.js');
const Tutor = require('./tutor.js');


const optionChoices = [
  'No comprobable',
  'Comprobable'
];

/*
 * Ingreso of a family and a member in case it is comprobable
 * 
 * Attributes:
 * ---------------
 * fecha: DATE
 *    This attribute is the date when the income was first received
 * tipo: STRING
 *    This attribute indicates the type of an income.
 * tutor: TUTOR
 *    This attribute creates a relation with a tutotr in case it is comprobable
 */

class Ingreso extends Transaccion {
  constructor () {
    super();

    this.fecha = {
      type: Date,
      default: Date.now
    };
    this.tipo = {
      type: String,
      choices: optionChoices,
      default: optionChoices[0],
      required: true,
    }
    this.tutor = Tutor;
  }
  static collectionName() {
    return 'Ingresos';
  }
}

module.exports = Ingreso;
