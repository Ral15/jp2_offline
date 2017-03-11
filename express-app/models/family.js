"use strict";

//require document class from camo
// var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;

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
 * bastards : NUMBER 
 *    Stores the number of children from different fathers within a family
 * martialStatus: STRING
 *    Stores the martial status of the family.
 * location: STRING
 *    Stores the location of the family.
 */

class Family extends EmbeddedDocument {
  constructor() {
    super();

    this.bastards = { 
      type: Number,
      default: 0,
      required: true
    };
    this.martialStatus = {
      type: String,
      default: '',
      choices: martialStatusChoices,
      required: true
    };
    this.location = {
      type: String,
      default: '',
      choices: locationChoices,
      required: true
    };
  }

  static collectionName() {
    return 'Familys';
  }
}

module.exports = Family;