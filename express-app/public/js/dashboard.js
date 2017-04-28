/**
 * This function shows a message to the user to make sure
 * the user wants to delete the selected estudio.
 * 
 * @event
 * @param {string} id - id of the estudio
 */
function showDeleteMsg(id) {
  swal({
    title: '¿Seguro que quieres borrar el estudio?',
    text: "No podras recuperar el estudio después de esta acción.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then(() => {
    deleteEstudio(id);
  });
}
/**
 * This function creates a POST to the estudio controller.
 * The body of the POST is the id of the desired estudio to delete. 
 *  IF response 201, it is successful and will show a message to the user
 * IF NOT, an error message will appear.
 *
 *
 * @event
 * @param {string} id - id of the estudio
 */
function deleteEstudio(id) {
 fetch('/estudio/delete/' + id, {
    method: 'post',
    body: JSON.stringify({
      id: id
    })
  })
  .then((response) => {
    if (response.status == 200) {
      swal(
        '¡Éxito!',
        'El estudio se ha borrado',
        'success'
      ).then(() => {
        location.reload();
      });
    }
    else {
      swal(
        '¡Error!',
        '¡El estudio no pudo ser borrado!',
        'error'
      );
    }
  })
  .catch((err) => {
    console.log(err);
    swal(
      '¡Error!',
      '¡No se puedo borrar el estudio!',
      'error'
    );    
  }); 
}

/**
 * This function shows a message to the user to make sure
 * the user wants to upload the selected estudio.
 * 
 * @event
 * @param {string} id - id of the estudio
 */
function showUploadMsg(id) {
  swal({
    title: '¿Seguro que quieres subir el estudio para validacion?',
    text: "No podras recuperar el estudio después de esta acción, hasta que sea revisado.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Subir',
    cancelButtonText: 'Cancelar'
  }).then(() => {
    uploadEstudio(id);
  });
}
/**
 * This function creates a POST to the estudio controller.
 * The body of the POST is the id of the desired estudio to delete. 
 *  IF response 201, it is successful and will show a message to the user
 * IF NOT, an error message will appear.
 *
 *
 * @event
 * @param {string} id - id of the estudio
 */
function uploadEstudio(id) {
 fetch('/estudio/upload/' + id, {
    method: 'post',
    body: JSON.stringify({
      id: id
    })
  })
  .then((response) => {
    if (response.status == 200) {
      swal(
        '¡Éxito!',
        'El estudio se ha subido',
        'success'
      ).then(() => {
        location.reload();
      });
    }
    else {
      swal(
        '¡Error!',
        '¡El estudio no pudo ser subido!',
        'error'
      );
    }
  })
  .catch((err) => {
    console.log(err);
    swal(
      '¡Error!',
      '¡No se pudo subir el estudio!',
      'error'
    );    
  }); 
}