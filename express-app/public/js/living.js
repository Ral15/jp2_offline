/**
 * This function shows a message to the user to make sure
 * the user wants to upload the selected estudio.
 *
 * @event
 * @param {string} id - id of the estudio
 */

$('#image').on('change', function () {
  var files = $(this).get(0).files;

  if (files.length > 0) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      formData.append('image[]', file , file.name);
    }

    $.ajax({
      url: '/image/save/',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log('save image success');
      },
    });
  }
});
