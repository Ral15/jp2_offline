"use strict";

//require document class from camo
var Document = require('camo').Document;
const Transaccion = require('./transaccion.js');

//options for martial status
const academicDegreeChoices = [
  '',
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
const relationOptions = [
  '',
  'tutor',
  'madre',
  'padre',
  'estudiante',
  'hermano/a',
  'abuelo/a',
  'tio/a',
];

const jobOptions = [
  '',
  'empleado/a',
  'obrero/a',
  'jefe_linea',
  'area_limpieza',
  'administrativo/a',
  'empleado/a_domestico',
  'jardinero/a',
  'plomero/a',
  'herrero/a',
  'carpintero/a',
  'albañil',
  'pintor/a',
  'mesero/a',
  'negocio_propio',
  'comerciante',
  'venta_productos',
  'otro',
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
 
class Miembro extends Document {
  constructor() {
    super();

    this.familyId = {
      type: String,
      required: true,
    };
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
      default: academicDegreeChoices[0],
      choices: academicDegreeChoices
    };
    this.fechaNacimiento = {
      type: String,
    };
    this.oficio = {
      type: String,
      choices: jobOptions,
    };
    this.observacionOficio = {
      type: String,
    };
    this.activo = {
      type: Boolean,
      default: true
    };
    this.sae = {
      type: String,
      default: '',
    };
    this.relacion = {
      type: String,
      default: relationOptions[0],
      choices: relationOptions,
    };
    this.escuela = {
      type: String,
      default: ''
    };
    this.observacionEscuela = {
      type: String,
      default: '',  
    };
    this.sacramentos = {
      type: String,
      default: '',
    };
    this.terapia = {
      type: String,
      default: '',
    };
  }

  static collectionName() {
    return 'Miembros';
  }

}

module.exports = Miembro;