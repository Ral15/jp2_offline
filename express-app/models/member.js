"use strict";

//require document class from camo
var Document = require('camo').Document;
const Family = require('./family.js');

//options for martial status
const academicDegreeChoices = [
  '1_grado',
  '2_grado',
  '3_grado',
  '4_grado',
  '5_grado',
  '6_grado',
  '7_grado',
  '8_grado',
  '9_grado',
  '10_grado',
  '11_grado',
  '12_grado',
  'universidad',
  'maestria',
  'doctorado'
];

/*
 * Member of a Family Model
 * 
 * Attributes:
 * ---------------
 * family : FR Family 
 *    Stores the number of children from different fathers within a family
 * firstName: STRING
 *    Stores the martial status of the family
 * lastName: STRING
 *    Stores the location of the family
 * phone: STRING
 *    Stores the phone number of a member
 * email: STRING
 *    Stores the email of a member
 * academicDegree: STRING
 *    Stores the highest academic degree of a member\
 * birthdate: DATE
 *    Stores the birthdate of a memeber
 * isActive: BOOL
 *    This attribute stores information about the involvment of a family member
 *    with the family itself.
 */
 
class Member extends Document {
  constructor() {
    super();

    this.family = Family;
    this.firstName = String;
    this.lastName = String;
    this.phone = String;
    this.email = String;
    this.academicDegree = {
      type: String,
      default: '',
      choices: academicDegreeChoices,
      required: true
    };
    this.birthdate = Date;
    this.isActive = Boolean;
  }

  static collectionName() {
    return 'Members';
  }
}

module.exports = Member;