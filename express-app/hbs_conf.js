//template engine
const path = require('path');
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname + '/views/partials'));
// pass to doc
hbs.registerHelper('ifEq', function(value1, value2, opt) {
    if (value1 == value2) {
        return opt.fn(this);
    }
    else {
        return opt.inverse(this);
    }
});

hbs.registerHelper('ifGt', function(value1, value2, opt) {
  if (value1 > value2) {
    return opt.fn(this);
  }
  else {
    return opt.inverse(this);
  }
});

hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

hbs.registerHelper('multiply', function(value1, value2) {
  return value1 * value2;
});

hbs.registerHelper('sum', function(value1, value2) {
  return value1 + value2;
});

hbs.registerHelper('lookQuestions', function(idQuestion, questionList, opt){
  let answers = [];
  for (var i = questionList.length - 1; i >= 0; i--) {
    if(questionList[i].idPregunta == idQuestion){
      let ans = {};
      ans.respuesta = questionList[i].respuesta;
      ans.orden = questionList[i].orden; 
      answers.push(ans);
    }
  }
  answers = answers.sort(function(v1, v2) {
    return v1.orden - v2.orden;
  })
  let ansFinal = [];
  for(let  i = 0; i < answers.length; i ++){
    ansFinal.push(answers[i].respuesta)
  }
  return opt.fn(ansFinal);
});

hbs.registerHelper('lookSelect', function(idQuestion, questionList, opt){
  let answers = [];
  for (var i = questionList.length - 1; i >= 0; i--) {
    if(questionList[i].idPregunta == idQuestion){
      return opt.fn(questionList[i].eleccion);
    }
  }
  return opt.fn(-1);
});

module.exports = hbs;