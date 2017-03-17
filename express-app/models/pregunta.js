"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
const OpcionRespuesta = require('./opcion_respuesta.js');


/*
 * The model that stores the actual questions.
 *
 *   Attributes:
 *   -----------
 *  id : Key
 *      The id for each question.
 *  subseccion : ForeignKey
 *      The subsection to which the question belongs.
 *   texto : TextField
 *      The question itself.
 *  descripcion : TextField
 *      Additional information that the question may need to have.
 *  orden : IntegerField
 *      The relative order of the question within the subsection.
 *  opciones_pregunta : OpcionRespuesta
 *      Embedded document of opcion respuesta.
 */
class Pregunta extends EmbeddedDocument {
    constructor() {
        super();

        this.id = Number;
        this.subseccion = Number;
        this.texto = String;
        this.descripcion = String;
        this.orden = Number;
        this.opciones_pregunta = [OpcionRespuesta];
    }

    static collectionName() {
        return 'pregunta';
    }
}

module.exports = Pregunta;
