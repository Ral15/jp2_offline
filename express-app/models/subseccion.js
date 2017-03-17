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
 *  idSeccion : ForeignKey
 *      The section to which the subsection belongs.
 *  nombre : TextField
 *      The name of the subsection.
 *  numero : IntegerField
 *      The number of the subsection.
 * preguntas : Pregunta
 *      Embedded Document of pregunta
 */
class Subseccion extends EmbeddedDocument {
    constructor() {
        super();

        this.id = {
          type: Number,
          default : 0,
          required : true
        };
        this.idSeccion = {
          type: Number,
          default : 1
        };
        this.nombre = {
          type : String,
          default : ''
        };
        this.numero = {
          type: Number,
          default : 0
        };
        this.preguntas = [Pregunta];
    }

    static collectionName() {
        return 'subseccion';
    }
}

module.exports = Subseccion;
