"use strict";

//require document class from camo
var Document = require('camo').Document;
var EmbeddedDocument = require('camo').EmbeddedDocument;
var Subseccion = require('./subseccion.js');

/**
 * The model that links questions to a particular section.
 *
 * Attributes:
 * -----------
 * nombre : String
 *  The name of the section.
 * numero : Number
 *  The number of the section.
 */
class Seccion extends EmbeddedDocument {
    constructor() {
        super();

        this.nombre = String;
        this.subseccion = [Subseccion];
    }

    static collectionName() {
        return 'seccion';
    }
}

module.exports = Seccion;
