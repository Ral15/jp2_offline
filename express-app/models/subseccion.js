"use strict";

//require document class from camo
var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;
var Pregunta = require('./pregunta.js');


/*
 * The model that represents a subsection within a section.
 *
 *  Attributes:
 *  -----------
 *  seccion : ForeignKey
 *      The section to which the subsection belongs.
 *  nombre : TextField
 *      The name of the subsection.
 *  numero : IntegerField
 *      The number of the section.
 */
class Subseccion extends EmbeddedDocument {
    constructor() {
        super();

        this.nombre = String;
        this.questions = [Pregunta];
    }

    static collectionName() {
        return 'subseccion';
    }
}

module.exports = Subseccion;
