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


describe('Delete Estudio test', function () {
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
    .then((newFamily) => {
      //save familyId
      // familyId = newFamily._id;
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
    .catch((e) => {
      console.log(e);
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
  * Test Delete estudio button with estudio._id
  *
  * Test if the crear-estudio button exists in the
  * application.
  */
  it('should see delete estudio button', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .then(() => {
        return client.$('#delete-estudio-' + estudioId);
      })
      .then((createBtn) => {
        assert.isNotNull(createBtn.value);
      });
  });

  /**
  * Test delete estudio
  *
  * This test will check if a modal shows before deleting an estudio
  */
  it('should see modal before deleting an estudio', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#delete-estudio-' + estudioId)
      .then(async () => {
        await sleep(1000);
        return client.getText('#swal2-content');
      })
      .then((modalText) => {
        assert.equal(modalText, 'No podras recuperar el estudio después de esta acción.');
      });
  });
  /**
  * Test delete estudio
  *
  * This test will cancel the modal
  */
  it('should cancel delete estudio sweetalert2', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#delete-estudio-' + estudioId)
      .waitForVisible('#swal2-content')
      .click('.swal2-cancel')
      .then(async () => {
        await sleep(1000);
        return client.$('#delete-estudio-' + estudioId);
      })
      .then((estudioButton) => {
        assert.isNotNull(estudioButton.value);
      });
  });
  /**
  * Test delete estudio
  *
  * This test will delete an estudio
  */
  it('should delete an estudio change its status', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#delete-estudio-' + estudioId)
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
        return client.click('#show-deleted');
      })
      .then(async () => {
        await sleep(1000);
        return client.isVisible('#restore-estudio-' + estudioId);
      })
      .then((isVisible) => {
        assert.isTrue(isVisible);
      })
  });
});
