const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
const Familia = require(path.join(__dirname , '../express-app/models/familia.js'));
const Miembro = require(path.join(__dirname , '../express-app/models/miembro.js'));
const Transaccion = require(path.join(__dirname , '../express-app/models/transaccion.js'));

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


describe('Create Outcomes test', function () {
  /**
  * Integration test suite for testing the creationg of Outcomes.
  *
  * Test if the creationg of Outcomes works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  //The time out to launch the app in the test.
  this.timeout(10000);

  let totalOutcomes;
  let estudioId;
  let familyId;
  let tutor;
  let student;
  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
      //create family object
      let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'Soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'Otro',
          nombreFamilia: 'Los Picapiedras',        
      });
      //save family
      return f.save();
    })
    .then((newFamily) => {
      //save familyId
      familyId = newFamily._id;
      //create estudio 
      let e = Estudio.create({
        tokenCapturista: config.apiToken,
        familia: newFamily,
      });  
      //save studio 
      return e.save();
    })
    .then((newEstudio) => {
      //save estudioId
      estudioId = newEstudio._id;
      //create tutor object
      let tutor = Miembro.create({
        familyId: familyId,
        nombres: 'Pepe',
        apellidos: 'Picapiedras',
        telefono: '44227270873',
        correo: 'pepe@picapepe.com',
        fechaNacimiento: '2010-09-10',
        oficio: 'albañil',
        observacionOficio: 'le da recio',
        sae: '',
        relacion: 'tutor',
        escuela: '',
        observacionEscuela: '',
      });
      //save tutor
      return tutor.save();
    })
    .then((newTutor) => {
      //save tutor object
      tutor = newTutor;
      //create student object
      let estudiante = Miembro.create({
        familyId: familyId,
        nombres: 'Morrito',
        apellidos: 'Picapiedras',
        telefono: '44227270873',
        correo: 'pepe@morropepe.com',
        fechaNacimiento: '2000-09-10',
        oficio: '',
        observacionOficio: '',
        sae: '15090',
        relacion: 'estudiante',
        escuela: 'Plantel Jurica',
        observacionEscuela: 'va mucho',
      });
      //save student
      return estudiante.save();
    })
    .then((newStudent) => {
      //save student object
      student = newStudent;
      return Transaccion.count({familyId: familyId, isIngreso: false});
    })
    .then((count) => {
      console.log(count);
      totalOutcomes = count;
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
  * Test createOutcome
  *
  * Test if the create outcome button exists in the
  * transactions view.
  */
  it('should see create outcome button for transactions', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .then(() => {
        return client.$('#add-outcome');
      })
      .then((addIncomeBtn) => {
        assert.isNotNull(addIncomeBtn.value);
      });
  });
  /**
  * Test fill form
  *
  * Test if you can enter data to the form
  */
  it('should fill createOutcome Modal', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#add-outcome')
      .waitForVisible('#createOutcome')
      .setValue('#createOutcome #amount', 5000)
      .$('#createOutcome #period').selectByAttribute('value', 'Mensual')
      .then(() => {
        return client.getValue('#createOutcome #amount');
      })
      .then((amountValue) => {
        assert.equal(amountValue, 5000);
        return client.$('#createOutcome #period').getValue();
      })
      .then((periodValue) => {
        assert.equal(periodValue, 'Mensual');
      });
  });
/**
  * Test fill form
  *
  * Test if you can enter data to the form
  */
  it('should fill with NO amount', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#add-outcome')
      .waitForVisible('#createOutcome')
      .setValue('#createOutcome #amount', '')
      .$('#createOutcome #period').selectByAttribute('value', 'Mensual')
      .then(() => {
        return client.getAttribute('#createOutcome #submit-outcome', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });
  });  
/**
  * Test fill form
  *
  * Test if you can enter data to the form
  */
  it('should fill with NO period', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#add-outcome')
      .waitForVisible('#createOutcome')
      .setValue('#createOutcome #amount', 5000)
      .$('#createOutcome #period').selectByAttribute('value', '')
      .then(() => {
        return client.getAttribute('#createOutcome #submit-outcome', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });
  });   
/**
  * Test fill form
  *
  * Test if you can enter data with errors
  */
  it('should fill & create outcome', async function () {
const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#add-outcome')
      .waitForVisible('#createOutcome')
      .setValue('#createOutcome #amount', 5000)
      .$('#createOutcome #period').selectByAttribute('value', 'Mensual')
      .click('#createOutcome #submit-outcome')
      .waitForVisible('#transactions-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Transaccion.count({familyId: familyId, isIngreso: false});
      })
      .then((newIncomes) => {
        assert.isBelow(totalOutcomes, newIncomes);
      });
  });
});
