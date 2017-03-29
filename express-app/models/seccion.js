// Require embedded document class from camo
const Document = require('camo').Document;
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
class Seccion extends Document {
  constructor() {
    super();

    this.idApi = {
      type: Number,
      default: 0,
      required: true,
    };
    this.nombre = {
      type: String,
      default: '',
    };
    this.numero = {
      type: Number,
      default: 0,
    };
    this.subsecciones = [Subseccion];
  }

  static collectionName() {
    return 'seccion';
  }
}

module.exports = Seccion;
