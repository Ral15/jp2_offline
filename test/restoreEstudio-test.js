const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
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


describe('Restore Estudio test', function () {
  /**
  * Integration test suite for testing the Login.
  *
  * Test if Login works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  //The time out to launch the app in the test.
  this.timeout(10000);

  let totalEstudios;
  let estudioId;

  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
      return Estudio.count()
    })
    .then((total) => {
      totalEstudios = total;
       let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'otro',
          nombreFamilia: 'Los Picapiedras',        
      });
      return f.save();
    })
    .then((f) => {
      let e = Estudio.create({
        //change later for config
        tokenCapturista: config.apiToken,
        familia: f,
        status: 'Eliminado',
      });
      return e.save();
    })
    .then((newEstudio) => {
      estudioId = newEstudio._id;
    })
    .catch((err) => {
      console.log(err);
    })
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
  * Test Restore estudio button with estudio._id
  *
  * Test if the restore-estudio button exists in the
  * application.
  */
  it('should see restore estudio button', function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#show-deleted')
      .waitForVisible('#datatable')
      .then(() => {
        return client.$('#restore-estudio-' + estudioId);
      })
      .then(async (restoreBtn) => {
        assert.isNotNull(restoreBtn.value);
      });
  });
  /**
  * Test restore estudio
  *
  * This test will check if a modal shows before restoring an estudio
  */
  it('should see modal before restoring an estudio', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#show-deleted')
      .waitForVisible('#datatable')
      .click('#restore-estudio-' + estudioId)
      .then(async () => {
        await sleep(1000);
        return client.getText('#swal2-content');
      })
      .then((modalText) => {
        assert.equal(modalText, 'Cambia el status del estudio para seguir editandolo.');
      });
  });
  /**
  * Test restore estudio
  *
  * This test will cancel the modal
  */
  it('should cancel restore estudio sweetalert2', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#show-deleted')
      .waitForVisible('#datatable')
      .click('#restore-estudio-' + estudioId)
      .waitForVisible('#swal2-content')
      .click('.swal2-cancel')
      .then(async () => {
        await sleep(1000);
        return client.$('#restore-estudio-' + estudioId);
      })
      .then((estudioButton) => {
        assert.isNotNull(estudioButton.value);
      });
  });
  /**
  * Test restore estudio
  *
  * This test will restore an estudio
  */
  it('should restore an estudio change its status', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#show-deleted')
      .waitForVisible('#datatable')
      .click('#restore-estudio-' + estudioId)
      .waitForVisible('#swal2-content')
      .click('.swal2-confirm')
      .then(async () => {
        await sleep(1000);
        return client.getText('#swal2-title');
      })
      .then(async (modalValue) => {
        assert.equal(modalValue, '¡Éxito!');
        await sleep(1000);
        return client.click('.swal2-confirm');
      })
      .then(async () => {
        await sleep(1000);
        return client.click('#show-borrador');
      })
      .then(async () => {
        await sleep(1000);
        return client.isVisible('#delete-estudio-' + estudioId);
      })
      .then((isVisible) => {
        assert.isTrue(isVisible);
      })
  });
});