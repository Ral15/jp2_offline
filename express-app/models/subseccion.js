"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
const Pregunta = require('./pregunta.js');


/*
 * The model that represents a subsection within a section.
 *
 *  Attributes:
 *  -----------
 *  id : Key
 *      The id for each subseccion.
 *  seccion : ForeignKey
 *      The section to which the subsection belongs.
 *  nombre : TextField
 *      The name of the subsection.
 *  numero : IntegerField
 *      The number of the section.
 * preguntas : Pregunta
 *      Embedded Document of pregunta
 */
class Subseccion extends EmbeddedDocument {
    constructor() {
        super();

        this.id = Number;
        this.seccion = Number;
        this.nombre = String;
        this.numero = Number;
        this.preguntas = [Pregunta];
    }

    static collectionName() {
        return 'subseccion';
    }
}

module.exports = Subseccion;
