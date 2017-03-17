"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;

/*
 * The model that stores the actual answers.
 *
 *  This model is the actual information from a study. Note that it
 *  can be related to an answer option, or to a family member, but both
 *  relations are not mandatory.
 *
 *  Attributes:
 *  -----------
 *  opcion_respuesta : ForeignKey
 *      If question has option answer, id is given
 *  pregunta : ForeignKey
 *      The question this answer is responding to.
 *  respuesta : TextField
 *      If the answer needs to have text, it will be stored in this attribute.
 */
class Respuesta extends EmbeddedDocument {
    constructor() {
        super();

        this.opcion_respuesta = Number;
        this.pregunta = Number;
        this.respuesta = String;
    }

    static collectionName() {
        return 'respuesta';
    }
}

module.exports = Respuesta;
