/**
 * This function shows a message to the user to make sure
 * the user wants to delete an income.
 * 
 * @event
 * @param {string} id - id of the member
 */
function showDeleteIncome(id) {
  swal({
    title: '¿Seguro que quieres borrar al ingreso?',
    text: "No podras recuperar al ingreso después de esta acción.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then(() => {
    deleteIncome(id);
  });
}
/**
 * This function creates a POST to the transactions controller.
 * The body of the POST is the id of the desired income to delete. 
 *  IF response 201, it is successful and will show a message to the user
 * IF NOT, an error message will appear.
 *
 *
 * @event
 * @param {string} id - id of the income
 */
function deleteIncome(id) {
 fetch('/transaction/delete/' + id, {
    method: 'post',
    body: JSON.stringify({
      id: id
    })
  })
  .then((response) => {
    if (response.status == 200) {
      swal(
        '¡Éxito!',
        'El ingreso se ha borrado',
        'success'
      ).then(() => {
        location.assign("/transactions/");
      });
    }
    else {
      swal(
        '¡Error!',
        '¡El ingreso no pudo ser borrado!',
        'error'
      );
    }
  })
  .catch((err) => {
    console.log(err);
    swal(
      '¡Error!',
      '¡No se puedo borrar el ingreso!',
      'error'
    );    
  }); 
}
/**
 * This function shows a message to the user to make sure
 * the user wants to delete an outcome.
 * 
 * @event
 * @param {string} id - id of the outcome
 */
function showDeleteOutcome(id) {
  swal({
    title: '¿Seguro que quieres borrar al egreso?',
    text: "No podras recuperar al egreso después de esta acción.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then(() => {
    deleteOutcome(id);
  });
}
/**
 * This function creates a POST to the transactions controller.
 * The body of the POST is the id of the desired outcome to delete. 
 *  IF response 201, it is successful and will show a message to the user
 * IF NOT, an error message will appear.
 *
 *
 * @event
 * @param {string} id - id of the outcome
 */
function deleteOutcome(id) {
 fetch('/transaction/delete/' + id, {
    method: 'post',
    body: JSON.stringify({
      id: id
    })
  })
  .then((response) => {
    if (response.status == 200) {
      swal(
        '¡Éxito!',
        'El egreso se ha borrado',
        'success'
      ).then(() => {
        location.assign("/transactions/");
      });
    }
    else {
      swal(
        '¡Error!',
        '¡El egreso no pudo ser borrado!',
        'error'
      );
    }
  })
  .catch((err) => {
    console.log(err);
    swal(
      '¡Error!',
      '¡No se puedo borrar el egreso!',
      'error'
    );    
  }); 
}
