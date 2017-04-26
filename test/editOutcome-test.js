const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
const Miembro = require(path.join(__dirname , '../express-app/models/miembro.js'));
const Transaccion = require(path.join(__dirname , '../express-app/models/transaccion.js'));
const Periodo = require(path.join(__dirname , '../express-app/models/periodo.js'));
const Familia = require(path.join(__dirname , '../express-app/models/familia.js'));
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


describe('Edit Outcome test', function () {
  /**
  * Integration test suite for testing if the app can delete an outcome.
  *
  * Test if the delete outcome works
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
  let transaction;

  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
      //create family object
      let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'otro',
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
      let myPeriod = Periodo.create({
        periodicidad: 'Mensual',
        factor: 1,
        multiplica: true,
      });
      let myTransaction = Transaccion.create({
        monto: 5000,
        periocidad: myPeriod,
        observacion: 'puro macizo',
        isIngreso: false,
        tipo: 'Comprobable',
        fecha: '2010-10-10',
        miembroId: tutor._id,
        familyId: familyId,
        nombreMiembro: tutor.nombres + ' ' + tutor.apellidos,
        valorMensual: -5000 , 
      });
      return myTransaction.save()
    })
    .then((newT) => {
      transaction = newT;
      return Transaccion.count({familyId: familyId, isIngreso: false})
    })
    .then((t) => {
      totalOutcomes = t;
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
  * Test edit outcome 
  *
  * Test if the edit-outcome button exists in the
  * application.
  */
  it('should see delete outcome button with id', async function () {
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
        return client.$('#edit-outcome-' + transaction._id);
      })
      .then((incomeBtn) => {
        assert.isNotNull(incomeBtn.value);
      });
  });
  /**
  * Test load inputs with outcome data
  *
  * Test if you can load form with tutor data
  */
  it('should show values of saved Outcome', async function () {
    const client = this.app.client;
    const editModal = '#editOutcomeModal-' + transaction._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#edit-outcome-' + transaction._id)
      .waitForVisible(editModal)
      .getValue(editModal + ' #amount')
      .then((amountValue) => {
        assert.equal(amountValue, transaction.monto);
        return client.$(editModal + ' #period').getValue();
      })
      .then((periodValue) => {
        assert.equal(periodValue, transaction.periocidad.periodicidad)
        return client.getValue(editModal + ' #observations');
      })
      .then((observationsValue) => {
        assert.equal(observationsValue, transaction.observacion);
      });
  });
/**
  * Test edit Outcome values
  *
  * Test if you can edit an outcome
  */
  it('should edit outcome ', async function () {
    const client = this.app.client;
    const editModal = '#editOutcomeModal-' + transaction._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#show-transactions-view')
      .waitForVisible('#transactions-section')
      .click('#edit-outcome-' + transaction._id)
      .waitForVisible(editModal)
      .setValue(editModal + ' #amount', 10)
      .$(editModal + ' #period').selectByAttribute('value', 'Anual')
      .click('#submit-editOutcome-' + transaction._id)
      .waitForVisible('#transactions-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Transaccion.findOne({_id: transaction._id});
      })
      .then(async (newTransaction) => {
        assert.notEqual(transaction.monto, newTransaction.monto);
        assert.notEqual(transaction.periocidad.periodicidad, newTransaction.periocidad.periodicidad);
      });
  });
});
