"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
const Subseccion = require('./subseccion.js');

/**
 * The model that links questions to a particular section.
 *
 * Attributes:
 * -----------
 * id : Key
 *  key of each seccion.
 * nombre : String
 *  The name of the section.
 * numero : Number
 *  The number of the section.
 */
class Seccion extends EmbeddedDocument {
    constructor() {
        super();

        this.id = Number;
        this.nombre = String;
        this.numero = Number;
        this.subseccion = [Subseccion];
    }

    static collectionName() {
        return 'seccion';
    }
}

module.exports = Seccion;
