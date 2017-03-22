"use strict";

//require document class from camo
// var Document = require('camo').Document;
var Document = require('camo').Document;
const Miembro = require('./miembro.js');
const Comentario = require('./comentario.js');

//options for martial status
const martialStatusChoices = [
  'Soltero',
  'Viudo',
  'Unión Libre',
  'Casado-Civil',
  'Casado-Iglesia',
  'Divorciado Vuelto a Casar'
];
//options for location
const locationChoices = [
  'Poblado Jurica',
  'Nabo',
  'Salitre',
  'La Campana',
  'Otro'
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
      default: '',
      choices: martialStatusChoices,
      required: true
    };
    this.localidad = {
      type: String,
      default: 'Otro',
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
    this.miembros = [Miembro];
    this.comentarios = [Comentario];

  }

  static collectionName() {
    return 'Familia';
  }
}

module.exports = Familia;