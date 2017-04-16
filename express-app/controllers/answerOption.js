const OpcionRespuesta = require('../models/opcionRespuesta');

module.exports = {
  /**
   * This function add a Answer Option in a Question.
   *
   *
   *
   * @function
   * @param {object} opcionRespuesta - opcionRespuesta object
   */
  addAnswerOption: function (opcionRespuesta) {
    return answerOption = OpcionRespuesta.create({
      idApi: opcionRespuesta.id,
      texto: opcionRespuesta.texto,
    });
  },
};
