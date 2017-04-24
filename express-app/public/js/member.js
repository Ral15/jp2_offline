$(document).ready(function(){


  $("#add-member-button").click(function(e) {
    e.preventDefault();
    $('#memberModal #schoolInput').hide();
    $('#memberModal #saeInput').hide();  
  });


    // hide or show certain fields based on the rol for the creation form
  $("#memberModal #role").change(function(e) {
    console.log('entre al memberModal')
    e.preventDefault();
    console.log(e);
    if (e.target.value == 'estudiante') {
      console.log(e.target.value)
      $('#memberModal #schoolInput').show();
      $('#memberModal #saeInput').show();
    }
    else {
      $('#memberModal #schoolInput').hide();
      $('#memberModal #saeInput').hide();
    }
  });

  $(".editMember").click(function(e) {
    e.preventDefault();
    let id = e.target.getAttribute('data-memberid');
    let role = $('#editMemberModal-'+id + ' #role').val();
    if(role == 'estudiante'){
      console.log(role);
      $('#editMemberModal-' + id + ' #schoolInput').show();
      $('#editMemberModal-' + id + ' #saeInput').show();
    }
    else {
      console.log('rorororo')
      $('#editMemberModal-' + id + ' #schoolInput').hide();
      $('#editMemberModal-' + id + ' #saeInput').hide();      
    }
  });


  //date time picker
  $('#datetimepicker4').datetimepicker({
    pickTime: false
  });

  //date time picker
  $('#datetimepicker5').datetimepicker({
    pickTime: false
  });


  // // function to tell if online
  // function isOnline() {
  //   // console.log(navigator.onLine)
  // 	if (navigator.onLine) {
  //     document.getElementById('estudios-btn').disabled = false
  //   }
  // 	else 
  //     document.getElementById('estudios-btn').disabled = true
  // }

  // // isOnline()
  // window.addEventListener('online',  isOnline)
  // window.addEventListener('offline',  isOnline)

  // isOnline()

// $('#memberModal #studenInputs').hide();




});


/**
 * This function shows a message to the user to make sure
 * the user wants to delete member.
 **TODO = delete everything associated with a member ex. transactions
 * 
 * @event
 * @param {string} id - id of the member
 */
function showDeleteMember(id) {
  swal({
    title: '¿Seguro que quieres borrar al miembro?',
    text: "No podras recuperar al miembro después de esta acción.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then(() => {
    deleteMember(id);
  });
}
/**
 * This function creates a POST to the family controller.
 * The body of the POST is the id of the desired member to delete. 
 *  IF response 201, it is successful and will show a message to the user
 * IF NOT, an error message will appear.
 *
 *
 * @event
 * @param {string} id - id of the member
 */
function deleteMember(id) {
 fetch('/member/delete/' + id, {
    method: 'post',
    body: JSON.stringify({
      id: id
    })
  })
  .then((response) => {
    if (response.status == 200) {
      swal(
        '¡Éxito!',
        'El miembro se ha borrado',
        'success'
      ).then(() => {
        location.assign("/members/");
      });
    }
    else {
      swal(
        '¡Error!',
        '¡El miembro no pudo ser borrado!',
        'error'
      );
    }
  })
  .catch((err) => {
    console.log(err);
    swal(
      '¡Error!',
      '¡No se puedo borrar el miembro!',
      'error'
    );    
  }); 
}
