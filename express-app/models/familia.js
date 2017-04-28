"use strict";

//require document class from camo
// var Document = require('camo').Document;
var Document = require('camo').Document;
const Miembro = require('./miembro.js');
const Comentario = require('./comentario.js');
const Transaccion = require('./transaccion.js');

//options for martial status
const martialStatusChoices = [
  'soltero',
  'viudo',
  'union_libre',
  'casado_civil',
  'casado_iglesia',
  'vuelto_a_casar',
];
//options for location
const locationChoices = [
  'poblado_jurica',
  'nabo',
  'salitre',
  'la_campana',
  'otro'
];

/*
 * Family Model
 * 
 * Attributes:
 * ---------------
 * bastardos : NUMBER 
 *    Stores the number of children from different fathers within a family
 * estadoCivil: STRING
 *    Stores the martial status of the family.
 * explicacionSolvencia: STRING
 *    How the family deals with the deficit
 * localidad: STRING
 *    Stores the location of the family.
 */

class Familia extends Document {
  constructor() {
    super();

    this.apiId = {
      type: Number,
    };

    this.bastardos = { 
      type: Number,
      default: 0,
      required: true
    };

    this.explicacionSolvencia = {
      type: String,
      default: ''
    };

    this.estadoCivil = {
      type: String,
      default: martialStatusChoices[0],
      choices: martialStatusChoices,
      required: true
    };

    this.localidad = {
      type: String,
      default: locationChoices[0],
      choices: locationChoices,
      required: true
    };

    this.calle = {
      type: String,
      required: true
    };

    this.colonia = {
      type: String,
      required: true
    };

    this.codigoPostal = {
      type: Number,
      required: true
    };

    this.nombreFamilia = {
      type: String,
      required: true,
    }
  }

  static collectionName() {
    return 'Familia';
  }
}

module.exports = Familia;