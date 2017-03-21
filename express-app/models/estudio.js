"use strict";

//require document class from camo
var Document = require('camo').Document;
const Familia = require('./familia.js');
const Seccion = require('./seccion.js');
const Respuesta = require('./respuesta.js');

// Options For Status
const opcionesStatusChoices = [
  'Aprobado',
  'Rechazado',
  'Borrador',
  'Revisión',
  'Eliminado'
];

/**
 * The model that represents a socioeconomical study.
 *
 *  This model contains the relations to link families and the actual
 *  information stored for each study.
 *
 *  Attributes:
 *  -----------
 *  opcionesStatusChoices : array (This atribute is out of the class)
 *      The options for the current status of a study.
 *  tokenCapturista : ForeignKey
 *      The relation to the capturista that filled the study.
 *  familia : OneToOneField
 *      The family of which the study is about.
 *  seccion : Seccion
 *      Embedded Document of array of seccions.
 *  respuestas : Respuesta
 *      Array embedded document of respuestas
 *  status : String
 *      The study can be in several states depending if it has been approved,
 *      is on revision, has been rejected, is a draft or was deleted.
 */
class Estudio extends Document {
  constructor() {
    super();

    this.tokenCapturista = {
      type : String,
      default : '',
      required : true
    };
    this.familia = Familia;
    this.seccion = [Seccion];
    this.respuestas = [Respuesta];
    this.status = {
      type: String,
      choices : opcionesStatusChoices,
      default : 'Borrador'
    }
    this.calle = {
      type: String,
      required: true
    };
    this.colonia = {
      type: String,
      required: true
    };
    this.codigoPostal = {
      type: Number,
      required: true
    };
    this.createdDate = {
      type: Date,
      default: Date.now
    };
    this.editedDate = {
      type: Date
    };
  }

  static collectionName() {
    return 'estudio';
  }

  preSave() {
    this.editedDate = Date();
  }

}

module.exports = Estudio;
