"use strict";

//require document class from camo
var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;

/*
 * The model that stores options for a particular question.
 *
 *  Attributes:
 *  -----------
 *  pregunta : ForeignKey
 *      The question for which these options are provided.
 *  texto : TextField
 *      The option for answer itself.
 */
class OpcionRespuesta extends EmbeddedDocument {
    constructor() {
        super();

        this.texto = String;
    }

    static collectionName() {
        return 'opcion respuesta';
    }
}

module.exports = OpcionRespuesta;
