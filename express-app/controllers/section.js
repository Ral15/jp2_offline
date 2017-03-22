const Seccion  = require('../models/seccion');
const Subsection = require('./subsection');

module.exports = {
  /**
   * This function add a Section in Studio.
   *
   *
   *
   * @function
   * @param {object} seccion - seccion object.
   */
  addSection: function(seccion) {
    let section = Seccion.create({
      idApi : seccion.id,
      nombre : seccion.nombre,
      numero : seccion.numero,
    });
    seccion.subsecciones.forEach(function (subsection) {
      section.subsecciones.push(Subsection.addSubsection(subsection));
    });
    return section;
  }
}
