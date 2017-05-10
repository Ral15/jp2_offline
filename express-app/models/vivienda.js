// Require embedded document class from camo
const Document = require('camo').Document;

/*
 * The model that stores the actual url photos of vivienda.
 *
 *  This model is the actual information from a study. Note that it
 *  can be related to vivienda.
 *
 *  Attributes:
 *  -----------
 *  idEstudio : ForeignKey
 *      The id of the estudio.
 *  name : String
 *      The name of the photo given.
 *  url : String
 *      The url of the photo.
 */
class Vivienda extends Document {
  constructor() {
    super();

    this.idEstudio = {
      type: String,
      required: true,
    };
    this.name = {
      type: String,
      default: '',
    };
    this.url = {
      type: String,
      default: '',
    };
  }

  static collectionName() {
    return 'vivienda';
  }

}

module.exports = Vivienda;
