"use strict";

//require document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;

//choices for periocidad
const periocidadChoices = [
  'Diario',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Bimestral',
  'Trimenstral',
  'Cuatrimestral',
  'Semestral',
  'Anual'
];
/*
 * Periocity of a Transaction
 * 
 * Attributes:
 * ---------------
 * periocidad: STRING
 *    Stores the different kinds of how a period can be.
 * factor: NUMBBER
 *    Stores the factor of a month
 * multiplica: BOOLEAN
 *    Tells if this period should be a multiplication
 */
 
class Periodo extends EmbeddedDocument {
  constructor() {
    super();

    this.periodicidad = {
      type: String,
      choices: periocidadChoices 
    };
    this.factor = {
      type: Number
    };
    this.multiplica = {
      type: Boolean
    };
  }

  static collectionName() {
    return 'Periodos';
  }
}

module.exports = Periodo;