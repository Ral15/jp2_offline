// require embedded document class from camo
const EmbeddedDocument = require('camo').EmbeddedDocument;
const OpcionRespuesta = require('./opcionRespuesta.js');

/*
 * The model that stores the actual questions.
 *
 *   Attributes:
 *   -----------
 *  idApi : Key
 *      The id for each question.
 *  idSubseccion : ForeignKey
 *      The subsection to which the question belongs.
 *   texto : String
 *      The question itself.
 *  descripcion : String
 *      Additional information that the question may need to have.
 *  orden : Number
 *      The relative order of the question within the subsection.
 *  opcionesPregunta : OpcionRespuesta
 *      Embedded document of opcion respuesta.
 */
class Pregunta extends EmbeddedDocument {
  constructor() {
    super();

    this.idApi = {
      type: Number,
      default: 0,
      required: true,
    };
    this.idSubseccion = {
      type: Number,
      default: 0,
    };
    this.texto = {
      type: String,
      default: '',
    };
    this.descripcion = {
      type: String,
      default: '',
    };
    this.orden = {
      type: Number,
      default: 0,
    };
    this.opcionesRespuesta = [OpcionRespuesta];
  }

  static collectionName() {
    return 'pregunta';
  }
}

module.exports = Pregunta;
