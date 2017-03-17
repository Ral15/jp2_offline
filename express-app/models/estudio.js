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
 *  capturista : ForeignKey
 *      The relation to the capturista that filled the study.
 *  familia : OneToOneField
 *      The family of which the study is about.
 *  seccion : Seccion
 *      Embedded Document of array of seccions.
 *  respuestas : Respuesta
 *      Array embedded document of respuestas
 *  status : TextField
 *      The study can be in several states depending if it has been approved,
 *      is on revision, has been rejected, is a draft or was deleted.
 */
class Estudio extends Document {
    constructor() {
        super();

        this.capturista = Number;
        this.familia = Familia;
        this.seccion = [Seccion];
        this.respuestas = [Respuesta];
        this.status = {
          type: String,
          choices : opcionesStatusChoices,
          default : 'Borrador'
        }

    }

    static collectionName() {
        return 'estudio';
    }
}

module.exports = Estudio;
