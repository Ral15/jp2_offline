const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
const Familia = require(path.join(__dirname , '../express-app/models/familia.js'));
const Miembro = require(path.join(__dirname , '../express-app/models/miembro.js'));
const config = require('../config.js');


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

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});


describe('Display sections test', function () {
  /**
  * Integration test suite for testing the Creation of members.
  *
  * Test if the creation of members works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  //The time out to launch the app in the test.
  this.timeout(10000);

  let estudioId;

  before(() => {
    //connect to db
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
  beforeEach(async function () {
    // Launch the application
    this.app = new Application({ path: electronPath, args:['.'] });
    return this.app.start();
  });


  // After test is complete we stop the app.
  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  after(() => {
    //delete database
    return database.dropDatabase();
  });
  /**
  * Test AddMember
  *
  * Test if the add-member button exists in the
  * members view.
  */
  it('should see addMember button', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .then(() => {
        return client.$('#add-member-button');
      })
      .then((addMemberBtn) => {
        assert.isNotNull(addMemberBtn.value);
      });
  });
/**
  * Test creating of a member with role 'Estudiante'
  *
  * Test if you can create a member
  */
  it('should submit & create a member with role Estudiante', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#memberModal #myModalLabel')
      .$('#memberModal #role').selectByAttribute('value', 'estudiante')
      .$('#memberModal #school').selectByAttribute('value', 'Plantel Jurica')
      .setValue('#memberModal #sae', '1598')
      .$('#memberModal #job').selectByAttribute('value', '')
      .setValue('#memberModal #firstName', 'Morro')
      .setValue('#memberModal #lastName', 'PicaPiedras')
      .setValue('#memberModal #phone', '442727272')
      .setValue('#memberModal #email', 'raul@mien.com')
      .$('#memberModal #academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#memberModal #birthDate', '2006-12-01')
      .click('#submit-addMember-form')
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.count({familyId: familyId});
      })
      .then((newTotal) => {
        assert.isBelow(totalMembers, newTotal);
      });
  });
});
