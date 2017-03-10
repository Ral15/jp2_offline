$(document).ready(function(){

  // add family and remove family inputs

  $("#add-family-input").click(function(e) {
    e.preventDefault();
    let input = ' <div class="row"> <div class="form-group col-xs-2"> <label for="firstName">Nombre</label> <input type="text" class="form-control" id="firstName" placeholder="Nombre"> </div><div class="form-group col-xs-2"> <label for="lastName">Apellido</label> <input type="text" class="form-control" id="lastName" placeholder="Apellido"> </div><div class="form-group col-xs-2"> <label for="age">Edad</label> <input type="text" class="form-control" id="age" placeholder="Edad"> </div><div class="form-group col-xs-1"> <label for="gender">Sexo</label> <select class="form-control" id="gender"> <option></option> <option value="M">M</option> <option value="F">F</option> </select> </div><div class="col-xs-3 form-group"> <div id="datetimepicker4" class="input-group"> <label for="birthDate">Fecha de nacimiento</label> <div class="input-group"> <span class="input-group-addon add-on" id="basic-addon1"> <i class="glyphicon glyphicon-calendar" aria-hidden="true"></i> </span> <input type="text" class="form-control" placeholder="" aria-describedby="basic-addon1" data-format="yyyy-MM-dd" type="text"> </div></div></div><div class="col-xs-2 form-group"> <button type="button" class="btn btn-danger" id="remove-family"> <span class="glyphicon glyphicon-minus" aria-hidden="true"> </span> </button> </div></div>';
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
