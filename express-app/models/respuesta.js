"use strict";

//require embedded document class from camo
var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;
var OpcionRespuesta = require('./opcion_respuesta.js');
var Integrante = require('./integrante.js');

/*
 * The model that stores the actual answers.
 *
 *  This model is the actual information from a study. Note that it
 *  can be related to an answer option, or to a family member, but both
 *  relations are not mandatory.
 *
 *  Attributes:
 *  -----------
 *  estudio : ForeignKey
 *      The study to which these answers belong.
 *  pregunta : ForeignKey
 *      The question this answer is responding to.
 *  opcion : ManyToManyField
 *      Optional relation to the options of the question, if the question
 *      requires them. It's a many to many rel. instead of a one to many since
 *      the question may need more than one option.
 *  integrante : ForeignKey
 *      If the question is related to a particular family member, this relationship
 *      indicates to which one.
 *  respuesta : TextField
 *      If the answer needs to have text, it will be stored in this attribute.
 */
class Respuesta extends EmbeddedDocument {
    constructor() {
        super();

        this.eleccion = {
          this.opcion = OpcionRespuesta
        };
        this.integrante = Integrante;
        this.respuesta = String
    }

    static collectionName() {
        return 'respuesta';
    }
}

module.exports = Respuesta;
