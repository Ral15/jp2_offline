/**
 * This function shows a message to the user to make sure
 * the user wants to upload the selected estudio.
 *
 * @event
 * @param {string} id - id of the estudio
 */
function showUploadPhoto() {
  swal({
    title: 'Subir Imagen',
    html: "<div class='row'><label for='photo' class='control-label'>Nombre del archivo</label>" +
          "<input type='text' class='form-control' name='photo' id='photo'></div><div class='row'>" +
          "<label for='image' class='control-label'>Imagen</label>" +
          "<input type='file' class='form-control' name='image' id='image'></div>",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Subir Imagen',
    cancelButtonText: 'Cancelar',
  }).then(() => {
    uploadPhoto();
  });
}

function uploadPhoto() {
  console.log('Image saved');
}
