"use strict";

const Miembro = require('./member.js');

//options for relations
const relationOptions = [
  "madre",
  "padre",
  "tutor"
];

/*
 * Member of a Family Model that is a Tutor
 * 
 * Attributes:
 * ---------------
 * isActive: BOOL
 *    This attribute stores information about the involvment of a family member
 *    with the family itself.
 */
 
class Tutor extends Miembro {
  constructor () {
    super();

    this.relation = {
      type: String,
      choices: relationOptions,
      required: true
    };
  }
}

module.exports = Tutor;