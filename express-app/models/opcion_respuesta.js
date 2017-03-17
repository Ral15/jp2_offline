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
 *  texto : TextField
 *      The option for answer itself.
 */
class OpcionRespuesta extends EmbeddedDocument {
    constructor() {
        super();

        this.id = Number;
        this.texto = String;
    }

    static collectionName() {
        return 'opcion_respuesta';
    }
}

module.exports = OpcionRespuesta;
