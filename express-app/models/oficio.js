"use strict";

//require document class from camo
var Document = require('camo').Document;


/*
 * School of the institution
 * 
 * Attributes:
 * ---------------
 * apiId: NUMBER
 *    Id of api to identify
 * name: STRING
 *    Name of schools
 */
 
class Oficio extends Document {
  constructor() {
    super();  

    this.apiId = {
      type: Number,
    };

    this.nombre = {
      type: String,
    };

  }

  static collectionName() {
    return 'Oficios';
  }
}

module.exports = Oficio;