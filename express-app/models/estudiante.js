"use strict";

const Miembro = require('./miembro.js');

/*
 * Member of a Family Model that is a Student
 * 
 * Attributes:
 * ---------------
 * sae: STRING
 *    This attribute is the unique identifier for each student.
 * isActive: BOOL
 *    This attribute stores information about the involvment of a family member
 *    with the family itself.
 */

class Estudiante extends Miembro {
  constructor () {
    super();


    this.sae = String;
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
