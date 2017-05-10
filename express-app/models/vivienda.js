"use strict";

//require document class from camo
var Document = require('camo').Document;
/*
 * Image of a family
 * 
 * Attributes:
 * ---------------
 * fecha: DATE
 *    Stores the date that the comment was created
 * texto: STRING
 *    Stores the content of the comment
 */
 
class Vivienda extends Document {
  constructor() {
    super();  

    this.estudioId = {
      type: String
    };

    this.path = {
      type: String
    };

    this.name = {
      type: String
    };
  }

  static collectionName() {
    return 'Viviendas';
  }
}

module.exports = Vivienda;