"use strict";

//require document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;


/*
 * Comment of a Family regarding its economic status
 * 
 * Attributes:
 * ---------------
 * family : FR Family 
 *    Stores the number of children from different fathers within a family
 * date: DATE
 *    Stores the date that the comment was created
 * text: STRING
 *    Stores the content of the comment
 */
 
class Comentario extends EmbeddedDocument {
  constructor() {
    super();

    this.date = {
      type: Date,
      default: Date.now
    };
    this.text = {
      type: String,
      default: ''
    };   
  }

  static collectionName() {
    return 'Comments';
  }
}

module.exports = Comentario;