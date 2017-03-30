"use strict";

//require document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;

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
 * familia : FR Family 
 *    Stores the number of children from different fathers within a family
 * nombres: STRING
 *    Stores the martial status of the family
 * apellidos: STRING
 *    Stores the location of the family
 * telefono: STRING
 *    Stores the phone number of a member
 * correo: STRING
 *    Stores the email of a member
 * nivelEstudios: STRING
 *    Stores the highest academic degree of a member\
 * fechaNacimiento: DATE
 *    Stores the birthdate of a memeber
 * activo: BOOL
 *    This attribute stores information about the involvment of a family member
 *    with the family itself.
 */
 
class Miembro extends EmbeddedDocument {
  constructor() {
    super();

    this.nombres = {
      type: String,
      default: ''
    };
    this.apellidos = {
      type: String,
      default: ''
    };
    this.telefono = {
      type: String,
      default: ''
    };
    this.correo = {
      type: String,
      default: ''
    };
    this.nivelEstudios = {
      type: String,
      default: '',
      choices: academicDegreeChoices
    };
    this.fechaNacimiento = {
      type: Date,
      default: ''
    };
    this.edad = {
      type: Number,
      default: 0
    };
    this.activo = {
      type: Boolean,
      default: true
    };
  }

  static collectionName() {
    return 'Miembros';
  }
}

module.exports = Miembro;