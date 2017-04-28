function appendClickRemove(){
  $('.remove-answer').click(function() {
    let ids = $(this).attr('id').split('_');
    let id_question = ids[3];
    let remove_id = ids[4];
    let ul = $('#ul_'+id_question);
    let lis = ul.find('li');
    let lisNum = lis.length;
    let values = [];
    let inputs = []
    let remove_li;
    let valid = true;
    for (var i = 0; i < lisNum; i++) {
      inputs.push($(lis[i]).find('input')[0]);
      if (i != remove_id)
        values.push(inputs[i].value);
      else{
        remove_li = lis[i];
        if(inputs[i].value == "")
          valid = false;
      }
    }
    if(valid)
      remAnswer(id_question, values, inputs, remove_li);
    else
      swal(
        '¡Error!',
        'Esta respuesta esta vacia',
        'error'
      );
  });
}
appendClickRemove();

$('.add-answer').click(function() {
  let ids = $(this).attr('id').split('_');
  let id_question = ids[3];
  let ul = $('#ul_'+id_question);
  let lis = ul.find('li');
  let lisNum = lis.length;
  let valid = true;
  for (var i = 0; i < lisNum; i++) {
    if($(lis[i]).find('input')[0].value === ""){
      valid = false;
    }
  }
  if(valid){
    ul.append('<li class="sectionAnswer" id="li_ans_'+id_question+'_'+lisNum+'">\
         <input type="text" id="'+sectionNum+'-'+ids[1]+'-'+ids[2]+'-'+lisNum+'" \
         name="'+sectionNum+'-'+ids[1]+'-'+ids[2]+'-'+lisNum+'" placeholder="No hay respuesta." \
         onchange="sendAnswer('+id_question+',this.value,'+lisNum+')">\
         <a id="remove_'+ids[1]+'_'+ids[2]+'_'+id_question+'_'+lisNum+'" class="btn btn-danger remove-answer" href="javascript:void(0)">-</a></li>'
         );    
    appendClickRemove();
  } else {
    swal(
      '¡Error!',
      'Hay respuestas vacias',
      'error'
    );
  }
});


$('.add-select').click(function() {
  let ids = $(this).attr('value').split('_');
  sendElection(ids[0],ids[1]);
});


function sendAnswer(idQuestion, valor, index){
  $.ajax({
    url : '/estudio/answer/',
    method : "POST",
    data : {
      "id_estudio"  : estudioId, 
      "id_seccion"  : sectionNum, 
      "id_pregunta" : idQuestion,
      "answer"      : valor,
      "index"       : index
    },
    success : function(response) {
      console.log(response)
      // append_anwser(id_question, response);
    },
    error : function(error){
      console.log(error);
    }
  });
}

function remAnswer(idQuestion, values, inputs, remove_li){
  $.ajax({
    url : '/estudio/answer/remove',
    method : "POST",
    data : {
      "id_estudio"  : estudioId, 
      "id_pregunta" : idQuestion
    },
    success : function(response) {
      // append_anwser(id_question, response);
      for (var i = 0; i < values.length; i++) {
        inputs[i].value = values[i];
        $(inputs[i]).trigger("change");
      }
      $(remove_li).remove();
    },
    error : function(error){
      console.log(error);
      swal(
        '¡Error!',
        'Hubo un error al borrar la respuesta',
        'error'
      );
    }
  });
}

function sendElection(idQuestion, idElect){
  $.ajax({
    url : '/estudio/answer/election',
    method : "POST",
    data : {
      "id_estudio"  : estudioId, 
      "id_seccion"  : sectionNum, 
      "id_pregunta" : idQuestion,
      "answer"      : idElect,
    },
    success : function(response) {
      console.log(response)
      // append_anwser(id_question, response);
    },
    error : function(error){
      console.log(error);
    }
  });
}