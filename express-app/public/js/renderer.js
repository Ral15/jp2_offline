$(document).ready(function(){

  // add family and remove family inputs

  $("#add-family-input").click(function(e) {
    e.preventDefault();
    let input = ' <div class="row" id="input-family"> <div class="form-group col-xs-3"> <label for="role">Rol</label> <select class="form-control" id="role" name="role"> <option></option> <option value="madre">Madre</option> <option value="padre">Padre</option> <option value="tutor">Tutor</option> <option value="estudiante">Estudiante</option> </select> </div><div class="form-group col-xs-3"> <label for="firstName">Nombre</label> <input type="text" class="form-control" name="firstName" id="firstName" placeholder="Nombre"> </div><div class="form-group col-xs-3"> <label for="lastName">Apellido</label> <input type="text" class="form-control" name="lastName" id="lastName" placeholder="Apellido"> </div><div class="form-group col-xs-2"> <label for="age">Edad</label> <input type="text" class="form-control" id="age" name="age" placeholder="Edad"> </div><div class="form-group col-xs-3"> <label for="academicDegree">Nivel estudios</label> <select class="form-control" id="academicDegree" name="academicDegree"> <option></option> <option value="1_grado">Primero Primaria</option> <option value="2_grado">Segundo Primaria</option> <option value="3_grado">Tercero Primaria</option> <option value="4_grado">Cuarto Primaria</option> <option value="5_grado">Quinto Primaria</option> <option value="6_grado">Sexto Primaria</option> <option value="7_grado">Primero Secundaria</option> <option value="8_grado">Segundo Secundaria</option> <option value="9_grado">Tercero Secundaria</option> <option value="10_grado">Primero Prepa</option> <option value="11_grado">Segundo Prepa</option> <option value="12_grado">Tercero Prepa</option> <option value="universidad">Universidad</option> <option value="maestria">Maestría</option> <option value="doctorado">Doctorado</option> </select> </div><div class="col-xs-3 form-group"> <div id="datetimepicker4" class="input-group"> <label for="birthDate">Fecha de nacimiento</label> <div class="input-group"> <span class="input-group-addon add-on" id="basic-addon1"> <i class="glyphicon glyphicon-calendar" aria-hidden="true"></i> </span> <input type="text" class="form-control" placeholder="" aria-describedby="basic-addon1" data-format="yyyy-MM-dd" type="text" name="birthDate"> </div></div></div><div class="form-group col-xs-2"> <label for="phone">Teléfono</label> <input type="tel" class="form-control" name="phone" id="phone" placeholder="442-8798-903"> </div><div class="form-group col-xs-3"> <label for="email">Correo electrónico</label> <input type="email" class="form-control" name="email" id="email" placeholder="eugenio@420.mx"> </div><div class="col-xs-1 form-group"> <button type="button" class="btn btn-danger" id="remove-family"> <span class="glyphicon glyphicon-minus" aria-hidden="true"> </span> </button> </div></div>';
    let wrap = "#family-wrapper";
    addInput(wrap, input);
  });

  $("#family-wrapper").on("click", "#remove-family", function(e) {
    e.preventDefault();
    $(this).parent('div').parent().remove();
  })

  /**
   * This function adds a new input in a wrapper,
   * it should receive the wrap-id and the html that
   * will be added in the form.
   * 
   * @event
   * @param {string} wrapId - id of wrapper
   * @param {string} rawHTML - raw html that will be added.
   */
  function addInput(wrapId, rawHTML) {
    //declare variables
    let input = rawHTML;
    let wrap = wrapId;
    //append html to wrapper
    $(wrap).append(rawHTML);
  }

    
  //date time picker
  $('#datetimepicker4').datetimepicker({
    pickTime: false
  });


  // function to tell if online
  function isOnline() {
    console.log(navigator.onLine)
  	if (navigator.onLine) {
      document.getElementById('estudios-btn').disabled = false
    }
  	else 
      document.getElementById('estudios-btn').disabled = true
  }

  // isOnline()
  window.addEventListener('online',  isOnline)
  window.addEventListener('offline',  isOnline)

  isOnline()
});
