const Pregunta = require('../models/pregunta');
const AnswerOption = require('./answerOption');

module.exports = {
  /**
   * This function add a Question in a Subsection.
   *
   *
   *
   * @function
   * @param {object} pregunta - pregunta object
   */
  addQuestion: function (pregunta) {
    const question = Pregunta.create({
      idApi: pregunta.id,
      idSubseccion: pregunta.subseccion,
      texto: pregunta.texto,
      descripcion: pregunta.descripcion,
      orden: pregunta.orden,
    });
    pregunta.opciones_pregunta.forEach(function (item) {
      question.opcionesRespuesta.push(AnswerOption.addAnswerOption(item));
    });
    return question;
  },
};
