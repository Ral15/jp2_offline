"use strict";

//require document class from camo
var Document = require('camo').Document;
const Family = require('./family.js');


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
 
class Comment extends Document {
  constructor() {
    super();

    this.family = Family;
    this.date = {
      type: Date,
      default: Date.now
    }
    this.text = String;   
  }

  static collectionName() {
    return 'Comments';
  }
}

module.exports = Comment;