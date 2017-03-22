const Pregunta  = require('../models/pregunta');
const AnswerOption = require('./answer-option');

module.exports = {
  /**
   * This function add a Question in a Subsection.
   *
   *
   *
   * @function
   * @param {object} pregunta - pregunta object
   */
  addQuestion: function(pregunta) {
    let question = Pregunta.create({
      idApi : pregunta.id,
      idSubseccion : pregunta.subseccion,
      texto : pregunta.texto,
      descripcion : pregunta.descripcion,
      orden : pregunta.orden,
    });
    pregunta.opciones_pregunta.forEach(function (item) {
      question.opcionesPregunta.push(AnswerOption.addAnswerOption(item));
    });
    return question;
  }
}
