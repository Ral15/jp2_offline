"use strict";

//require document class from camo
var Document = require('camo').Document;
var Seccion = require('seccion');

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
        numero_sae = String;
        this.seccion = [Seccion];
        this.status = {
          type: String,
          choices : ['Aprobado', 'Rechazado', 'Borrador', 'Revisión', 'Eliminado']
        }

    }

    static collectionName() {
        return 'estudio';
    }
}

module.exports = Estudio;
