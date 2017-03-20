"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;

/*
 * The model that stores options for a particular question.
 *
 *  Attributes:
 *  -----------
 *  id : Key
 *      The opcion question id for which option.
 *  texto : String
 *      The option for answer itself.
 */
class OpcionRespuesta extends EmbeddedDocument {
    constructor() {
        super();

        this.id = {
          type : Number,
          default : 0,
          required : true
        }
        this.texto = {
          type : String,
          default : ''
        };
    }

    static collectionName() {
        return 'opcion_respuesta';
    }
}

module.exports = OpcionRespuesta;
