"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
const Subseccion = require('./subseccion.js');

/**
 * The model that links questions to a particular section.
 *
 * Attributes:
 * -----------
 * idApi : Key
 *  key of each seccion.
 * nombre : String
 *  The name of the section.
 * numero : Number
 *  The number of the section.
 */
class Seccion extends EmbeddedDocument {
    constructor() {
        super();

        this.idApi = {
          type : Number,
          default : 0,
          required : true
        };
        this.nombre = {
          type : String,
          default : ''
        };
        this.numero = {
          type : Number,
          default : 0
        };
        this.subsecciones = [Subseccion];
    }

    static collectionName() {
        return 'seccion';
    }
}

module.exports = Seccion;
