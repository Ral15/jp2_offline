// Require embedded document class from camo
const EmbeddedDocument = require('camo').EmbeddedDocument;

/*
 * The model that stores the actual answers.
 *
 *  This model is the actual information from a study. Note that it
 *  can be related to an answer option, or to a family member, but both
 *  relations are not mandatory.
 *
 *  Attributes:
 *  -----------
 *  idApi : Key
 *      key of each Respuesta.
 *  pregunta : ForeignKey
 *      The question this answer is responding to.
 *  opcionRespuesta : ForeignKey
 *      If question has option answer, id is given
 *  respuesta : TextField
 *      If the answer needs to have text, it will be stored in this attribute.
 */
class Respuesta extends EmbeddedDocument {
  constructor() {
    super();

    this.idApi = {
      type: Number,
      default: 0,
    };
    this.idPregunta = {
      type: Number,
      default: 0,
      required: true,
    };
    this.idOpcionRespuesta = {
      type: Number,
      default: 0,
    };
    this.respuesta = {
      type: String,
      default: '',
    };
  }

  static collectionName() {
    return 'respuesta';
  }
}

module.exports = Respuesta;
