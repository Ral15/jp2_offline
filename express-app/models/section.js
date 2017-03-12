"use strict";

//require document class from camo
var Document = require('camo').Document;

/**
 * Create section model with the basic fields for testing
 * The model that links questions to a particular section.
 *
 * Attributes:
 * -----------
 * nombre : String
 *  The name of the section.
 * numero : Number
 *  The number of the section.
 */
class Seccion extends Document {
    constructor() {
        super();

        this.nombre = String;
        this.numero = Number;
    }

    static collectionName() {
        return 'seccion';
    }
}

module.exports = Seccion;
