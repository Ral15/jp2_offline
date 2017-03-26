const Subsection = require('../models/subseccion');
const Question = require('./question');

module.exports = {
  /**
   * This function add a Subsection in a Section.
   *
   *
   *
   * @function
   * @param {object} subseccion - subseccion object
   */
  addSubsection: function (subseccion) {
    const subsection = Subsection.create({
      idApi: subseccion.id,
      idSeccion: subseccion.seccion,
      nombre: subseccion.nombre,
      numero: subseccion.numero,
    });
    subseccion.preguntas.forEach(function (item) {
      subsection.preguntas.push(Question.addQuestion(item));
    });
    return subsection;
  },
};
