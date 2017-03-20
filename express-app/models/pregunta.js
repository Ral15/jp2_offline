"use strict";

//require embedded document class from camo
var EmbeddedDocument = require('camo').EmbeddedDocument;
const OpcionRespuesta = require('./opcion-respuesta.js');


/*
 * The model that stores the actual questions.
 *
 *   Attributes:
 *   -----------
 *  id : Key
 *      The id for each question.
 *  idSubseccion : ForeignKey
 *      The subsection to which the question belongs.
 *   texto : String
 *      The question itself.
 *  descripcion : String
 *      Additional information that the question may need to have.
 *  orden : Number
 *      The relative order of the question within the subsection.
 *  opcionesPregunta : OpcionRespuesta
 *      Embedded document of opcion respuesta.
 */
class Pregunta extends EmbeddedDocument {
    constructor() {
        super();

        this.id = {
          type : Number,
          default : 0,
          required : true
        };
        this.idSubseccion = {
          type : Number,
          default : 0
        };
        this.texto = {
          type : String,
          default : ''
        };
        this.descripcion = {
          type : String,
          default : ''
        };
        this.orden = {
          type : Number,
          default : 0
        };
        this.opcionesPregunta = [OpcionRespuesta];
    }

    static collectionName() {
        return 'pregunta';
    }
}

module.exports = Pregunta;
