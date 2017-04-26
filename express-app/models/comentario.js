"use strict";

//require document class from camo
var Document = require('camo').Document;


/*
 * Comment of a Family regarding its economic status
 * 
 * Attributes:
 * ---------------
 * fecha: DATE
 *    Stores the date that the comment was created
 * texto: STRING
 *    Stores the content of the comment
 */
 
class Comentario extends Document {
  constructor() {
    super();  

    this.familyId = {
      type: String,
      required: true,
    }

    this.fecha = {
      type: Date,
      default: Date.now
    };
    this.texto = {
      type: String,
      default: ''
    };   
  }

  static collectionName() {
    return 'Comentarios';
  }
}

module.exports = Comentario;