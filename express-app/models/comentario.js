"use strict";

//require document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;


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
 
class Comentario extends EmbeddedDocument {
  constructor() {
    super();

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