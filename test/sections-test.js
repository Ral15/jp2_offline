const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
const Familia = require(path.join(__dirname , '../express-app/models/familia.js'));
const Seccion = require(path.join(__dirname , '../express-app/models/seccion.js'));
const config = require('../config.js');
const fs = require('fs');

//Database connection
const connect = require(path.join(__dirname , '../express-app/node_modules/camo')).connect;
var database;
const dbUri = 'nedb://testDB';
//end DB connection

// Set the direction to launch the electron app.
let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
// If the platform is win32, we use de .cmd to launch
// the app.

if (process.platform === 'win32') {
  electronPath += '.cmd';
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let deleteFolderRecursive = function(fPath) {
  if( fs.existsSync(fPath) ) {
    fs.readdirSync(fPath).forEach(function(file,index){
      var curPath = fPath + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(fPath);
  }
};


global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});


describe('Sections test', function () {
  /**
  * Integration test suite for testing the display and use of sections.
  *
  * Test if the display and use of sections works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  //The time out to launch the app in the test.
  this.timeout(15000);

  let estudioId;
  let testSection;
  let testQuestion;
  let testIdApi;
  let testText = 'prueba thelma';


  before(async () => {
    //connect to db
    await deleteFolderRecursive('./testDB');
    connect(dbUri).then((db) => {
      database = db;
      //create family
      let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'Soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'Otro',
          nombreFamilia: 'Los Picapiedras',        
      });
      return f.save();
    })
    .then((newFamily) => {
      //create estudio 
      let e = Estudio.create({
        //change later for config
        tokenCapturista: config.apiToken,
        familia: newFamily,
      });   
      return e.save();   
    })
    .then((newEstudio) => {
      estudioId = newEstudio._id;
    })
    .catch((err) => {
      console.log(err);
    });
    // end Database connection
  });

  // Before everything we launch the app.
  beforeEach(function () {
    // Launch the application
    this.app = new Application({ path: electronPath, args:['.'] });
    return this.app.start();
  });


  // After test is complete we stop the app.
  afterEach( function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  after(() => {
    //delete database
    return database.dropDatabase();
  });
  /**
  * Test Show sections
  *
  * Test if the loaded sections are correctly displayed
  */
  it('should see sections',  function () {
    const client = this.app.client;
    // await sleep(500);
    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .click('#home_link')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.findOne({numero:1});
      })
      .then((seccion) => {
        testSection = seccion;
        let subs = testSection.subsecciones;
        for(let i = 0; i < subs.length; i++){
          if(subs[i].numero == 1){
            for(let j = 0; j < subs[i].preguntas.length ; j++){
              if(subs[i].preguntas[j].orden == 1 ){
                testQuestion = subs[i].preguntas[j];
                break;
              }
            }
            break;
          }
        }
        testIdApi = testQuestion.idApi;
        return client;
      })
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#nav_section_menu')
      .click('#nav_section_menu')
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.getText(("#title_q_"+testIdApi))
      })
      .then((text) => {
        assert.equal(text,testQuestion.texto);
      });
  });
  /**
  * Test edit sections
  *
  * Test if the loaded sections are correctly edited
  */
  it('should edit section text answer',  function () {
    const client = this.app.client;
    // await sleep(500);
    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .click('#home_link')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.findOne({numero:1});
      })
      .then((seccion) => {
        testSection = seccion;
        let subs = testSection.subsecciones;
        for(let i = 0; i < subs.length; i++){
          if(subs[i].numero == 1){
            for(let j = 0; j < subs[i].preguntas.length ; j++){
              if(subs[i].preguntas[j].orden == 1 ){
                testQuestion = subs[i].preguntas[j];
                break;
              }
            }
            break;
          }
        }
        testIdApi = testQuestion.idApi;
        return client;
      })
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#nav_section_menu')
      .click('#nav_section_menu')
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .setValue(testText)
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .getValue()
      })
      .then((text) => {
        assert.equal(text, testText)
         return client.$('#li_ans_'+testIdApi+'_0 a')
          .click()
      }).then(() => {
        return;
      });
  });
  /**
  * Test add answer sections
  *
  * Test if the loaded sections are correctly edited with more than one answer
  */
  it('should edit and add section text answer',  function () {
    const client = this.app.client;
    // await sleep(500);
    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .click('#home_link')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.findOne({numero:1});
      })
      .then((seccion) => {
        testSection = seccion;
        let subs = testSection.subsecciones;
        for(let i = 0; i < subs.length; i++){
          if(subs[i].numero == 1){
            for(let j = 0; j < subs[i].preguntas.length ; j++){
              if(subs[i].preguntas[j].orden == 1 ){
                testQuestion = subs[i].preguntas[j];
                break;
              }
            }
            break;
          }
        }
        testIdApi = testQuestion.idApi;
        return client;
      })
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#nav_section_menu')
      .click('#nav_section_menu')
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .setValue(testText)
          .click('#add_1_1_'+testIdApi)
          .waitForVisible('#li_ans_'+testIdApi+'_1')
      })
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_1 input')
          .setValue(testText + '2')
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {

        return client.$('#li_ans_'+testIdApi+'_0 input')
          .getValue()
      })
      .then((text) => {
        assert.equal(text, testText)
      })
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_1 input')
          .getValue()
      })
      .then((text) => {
        assert.equal(text, (testText + '2'))
        return client.$('#li_ans_'+testIdApi+'_1 a')
          .click()
          .$('#li_ans_'+testIdApi+'_0 a')
          .click()
      })
      .then(() => {
        return;
      });
  });
  /**
  * Test edit and remove answers of sections
  *
  * Test if the loaded sections are correctly edited and removed
  */
  it('should add and remove section text answer',  function () {
    const client = this.app.client;
    // await sleep(500);
    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .click('#home_link')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.findOne({numero:1});
      })
      .then((seccion) => {
        testSection = seccion;
        let subs = testSection.subsecciones;
        for(let i = 0; i < subs.length; i++){
          if(subs[i].numero == 1){
            for(let j = 0; j < subs[i].preguntas.length ; j++){
              if(subs[i].preguntas[j].orden == 1 ){
                testQuestion = subs[i].preguntas[j];
                break;
              }
            }
            break;
          }
        }
        testIdApi = testQuestion.idApi;
        return client;
      })
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#nav_section_menu')
      .click('#nav_section_menu')
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .setValue(testText)
          .click('#add_1_1_'+testIdApi)
          .waitForVisible('#li_ans_'+testIdApi+'_1')
      })
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_1 input')
          .setValue(testText + '2')
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .getValue()
      })
      .then((text) => {
        assert.equal(text, testText)
      })
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_1 input')
          .getValue()
      })
      .then((text) => {
        assert.equal(text, (testText + '2'))
        return client.$('#li_ans_'+testIdApi+'_0 a')
          .click()
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .getValue()
      })
      .then((valor) => {
        assert.equal(valor, testText + '2')
        return client.$('#li_ans_'+testIdApi+'_0 a')
          .click()
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#li_ans_'+testIdApi+'_0 input')
          .getValue()
      })
      .then((valor) => {
        assert.equal(valor,'');
      });
    });
   /**
  * Test edit select sections
  *
  * Test if the loaded sections are correctly edited in the select answers
  */

   it('should select section answer',  function () {
    const client = this.app.client;
    // await sleep(500);
    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .click('#home_link')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.findOne({numero:1});
      })
      .then((seccion) => {
        testSection = seccion;
        let subs = testSection.subsecciones;
        for(let i = 0; i < subs.length; i++){
          if(subs[i].numero == 0){
            for(let j = 0; j < subs[i].preguntas.length ; j++){
              if(subs[i].preguntas[j].orden == 1){
                testQuestion = subs[i].preguntas[j];
                break;
              }
            }
            break;
          }
        }
        testIdApi = testQuestion.idApi;
        return client;
      })
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#nav_section_menu')
      .click('#nav_section_menu')
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.$('#sel_'+testIdApi+'_1 input').click()
      })
      .click('#seccion_link_1')
      .waitForVisible('#section_1')
      .then(() => {
        return client.isSelected('#sel_'+testIdApi+'_0 input')
      }).then((selected) => {
        assert.isFalse(selected)
        return client.isSelected('#sel_'+testIdApi+'_1 input')
      }).then((selected) => {
        assert.isTrue(selected)
      });
  });
});
