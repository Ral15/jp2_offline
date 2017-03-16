"use strict";

//require document class from camo
var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;
const Respuesta = require('./respuesta.js');


/*
 * The model that stores the actual questions.
 *
 *   Attributes:
 *   -----------
 *  subseccion : ForeignKey
 *      The subsection to which the question belongs.
 *   texto : TextField
 *      The question itself.
 *  descripcion : TextField
 *      Additional information that the question may need to have.
 *  orden : IntegerField
 *      The relative order of the question within the subsection.
 */
class Pregunta extends EmbeddedDocument {
    constructor() {
        super();

        this.texto = String;
        this.descripcion = String;
        this.respuesta = Respuesta;
    }

    static collectionName() {
        return 'pregunta';
    }
}

module.exports = Pregunta;
