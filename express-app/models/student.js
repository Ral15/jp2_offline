"use strict";

const Miembro = require('./member.js');

/*
 * Member of a Family Model that is a Student
 * 
 * Attributes:
 * ---------------
 * isActive: BOOL
 *    This attribute stores information about the involvment of a family member
 *    with the family itself.
 */

class Estudiante extends Miembro {
  constructor () {
    super();


    this.spei = Number;
    this.isActive = {
      type: Boolean,
      default: true
    };
  }
  static collectionName() {
    return 'Students';
  }
}

module.exports = Estudiante;