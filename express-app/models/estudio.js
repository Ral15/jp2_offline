"use strict";

//require document class from camo
var Document = require('camo').Document;

/**
 * The model that represents a socioeconomical study.
 *
 *  This model contains the relations to link families and the actual
 *  information stored for each study.
 *
 *  Attributes:
 *  -----------
 *  OPCIONES_STATUS : tuple(tuple())
 *      The options for the current status of a study.
 *  capturista : ForeignKey
 *      The relation to the capturista that filled the study.
 *  familia : OneToOneField
 *      The family of which the study is about.
 *  status : TextField
 *      The study can be in several states depending if it has been approved,
 *      is on revision, has been rejected, is a draft or was deleted.
 *  numero_sae : TextField
 *      Todo: more information on this field. It appears to be some sort of
 *      id for studies (refer to the sample study provided by the stakeholder).
 */
class Estudio extends Document {
    constructor() {
        super();

        this.capturista = User;
        this.familia = Familia;
        this.status = String;
        numero_sae = String;
    }

    static collectionName() {
        return 'estudio';
    }
}

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
class Subseccion extends Document {
    constructor() {
        super();

        this.seccion = Seccion;
        this.nombre = String;
        this.numero = Number;
    }

    static collectionName() {
        return 'subseccion';
    }
}

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
class Pregunta extends Document {
    constructor() {
        super();

        this.subseccion = Subseccion;
        this.texto = String;
        this.descripcion = String;
        this.numero = Number;
    }

    static collectionName() {
        return 'pregunta';
    }
}

/*
 * The model that stores options for a particular question.
 *
 *  Attributes:
 *  -----------
 *  pregunta : ForeignKey
 *      The question for which these options are provided.
 *  texto : TextField
 *      The option for answer itself.
 */
class OpcionRespuesta extends Document {
    constructor() {
        super();

        this.pregunta = Pregunta;
        this.texto = String;
    }

    static collectionName() {
        return 'opcion respuesta';
    }
}

/*
 * The model that stores the actual answers.
 *
 *  This model is the actual information from a study. Note that it
 *  can be related to an answer option, or to a family member, but both
 *  relations are not mandatory.
 *
 *  Attributes:
 *  -----------
 *  estudio : ForeignKey
 *      The study to which these answers belong.
 *  pregunta : ForeignKey
 *      The question this answer is responding to.
 *  opcion : ManyToManyField
 *      Optional relation to the options of the question, if the question
 *      requires them. It's a many to many rel. instead of a one to many since
 *      the question may need more than one option.
 *  integrante : ForeignKey
 *      If the question is related to a particular family member, this relationship
 *      indicates to which one.
 *  respuesta : TextField
 *      If the answer needs to have text, it will be stored in this attribute.
 */
class Respuesta extends Document {
    constructor() {
        super();

        this.estudio = Estudio;
        this.pregunta = Pregunta;
        this.eleccion = {
          opcion = OpcionRespuesta
        };
        this.integrante = Integrante;
        this.respuesta = String
    }

    static collectionName() {
        return 'respuesta';
    }
}

module.exports = Estudio;
