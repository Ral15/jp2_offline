const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../../express-app/models/estudio.js'));


//Database connection
const connect = require('camo').connect;
var database;
const dbUri = 'nedb://testDB';
//end DB connection

// Set the direction to launch the electron app.
let electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron');
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


describe('Create Estudio test', function () {
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
  before(() => {
    connect(dbUri).then((db) => {
      database = db;
      return Estudio.count()
    })
    .then((total) => {
      console.log(total);
      totalEstudios = total;
    });
    // end Database connection
  });

  // Before everything we launch the app.
  beforeEach(async function () {
    // connect(dbUri).then((db) => {
    //   database = db;
    //   return Estudio.count()
    // })
    // .then((total) => {
    //   console.log(total);
    //   totalEstudios = total;
    // });
    // Launch the application
    this.app = new Application({ path: electronPath, args:['.'] });
    await this.app.start();
    // return this.app.start();
  });

  // after(() => {
  //   Estudio.deleteMany();
  // });

  // After test is complete we stop the app.
  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
      connect(dbUri).then((db) => {
      database = db;
      return Estudio.count()
    })
    .then((total) => {
      console.log(total);
      totalEstudios = total;
    });
      console.log(await Estudio.count())
    }
  });

//   /**
//   * Test Create Estudio Button
//   *
//   * Test if the crear-estudio button exists in the
//   * application.
//   */
//   it('should see create estudio button', async function () {
//     const client = this.app.client;
//     // await sleep(500);
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .then(() => {
//         return client.$('#crear-estudio');
//       })
//       .then((createBtn) => {
//         assert.isNotNull(createBtn.value);
//       });
//   });

//   /**
//   * Test create Estudio form
//   *
//   * This test will check if there is a form to create a estudio
//   */
//   it('should fill create estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '23094')
//       .setValue('#bastards', '100')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getValue('#street');
//       })
//       .then((streetValue) => {
//         assert.equal(streetValue, 'Priv. Camino Real #112 int #9');
//         return client.getValue('#street2');
//       })
//       .then((street2Value) => {
//         assert.equal(street2Value, 'Los Fresnos');
//         return client.getValue('#zipCode');
//       })
//       .then((zipCodeValue) => {
//         assert.equal(zipCodeValue, '23094');
//         return client.getValue('#bastards');
//       })
//       .then((bastardsValue) => {
//         assert.equal(bastardsValue, '100');
//         return client.$('#location').getValue();
//       })
//       .then((locationValue) => {
//         assert.equal(locationValue, 'Otro');
//         return client.$('#martialStatus').getValue();
//       })
//       .then((martialValue) => {
//         assert.equal(martialValue, 'Soltero');
//         return client.$('#create-family');
//       })
//       .then((valueButton) => {
//         assert.isNotNull(valueButton.value);
//       });
//   });
//   /**
//   * Test create Estudio form with no input for street
//   *
//   * This test will check if the form is validated
//   */
//   it('should fill with NO street value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', '')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '76159')
//       .setValue('#bastards', '100')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
//   /**
//   * Test create Estudio form with no input for street2
//   *
//   * This test will check if the form is valdated
//   */
//   it('should fill with NO street2 value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', '')
//       .setValue('#zipCode', '76159')
//       .setValue('#bastards', '100')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
//   /**
//   * Test create Estudio form with no input for zipCode
//   *
//   * This test will check if the form is valdated
//   */
//   it('should fill with NO zipCode value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '')
//       .setValue('#bastards', '100')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
// /**
//   * Test create Estudio form with no input for bastards
//   *
//   * This test will check if the form is valdated
//   */
//   it('should fill with NO bastards value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '76159')
//       .setValue('#bastards', '')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
// /**
//   * Test create Estudio form with no input for location
//   *
//   * This test will check if the form is valdated
//   */
//   it('should fill with NO location value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '76159')
//       .setValue('#bastards', '100')
//       .$('#location').selectByAttribute('value', '')
//       .$('#martialStatus').selectByAttribute('value', 'Soltero')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
// /**
//   * Test create Estudio form with no input for martialStatus
//   *
//   * This test will check if the form is valdated
//   */
//   it('should fill with NO martialStatus value estudio form', async function () {
//     const client = this.app.client;
//     return client.setValue('#username','raul')
//       .setValue('#password','erikiado123')
//       .click('#submit-login')
//       .click('#crear-estudio')
//       .waitForVisible('#street')
//       .setValue('#street', 'Priv. Camino Real #112 int #9')
//       .setValue('#street2', 'Los Fresnos')
//       .setValue('#zipCode', '76159')
//       .setValue('#bastards', '1')
//       .$('#location').selectByAttribute('value', 'Otro')
//       .$('#martialStatus').selectByAttribute('value', '')
//       .then(() => {
//         return client.getAttribute('#create-family', 'class');
//       })
//       .then((buttonAttributes) => {
//         assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
//       });
//   });
/**
  * Test create Estudio form
  *
  * This test will check if an estudio is created in the db
  */
  it('should fill with NO martialStatus value estudio form', async function () {
    const client = this.app.client;
    console.log(totalEstudios);
    // console.log(initEstudios);
    return client.setValue('#username','raul')
      .setValue('#password','erikiado123')
      .click('#submit-login')
      .click('#crear-estudio')
      .waitForVisible('#street')
      .setValue('#street', 'Priv. Camino Real #112 int #9')
      .setValue('#street2', 'Los Fresnos')
      .setValue('#zipCode', '76159')
      .setValue('#bastards', '1')
      .$('#location').selectByAttribute('value', 'Otro')
      .$('#martialStatus').selectByAttribute('value', 'Soltero')
      .click('#create-family')
      .waitForVisible('#familySection')
      .then(() => {
        // await sleep(5000);
        // return client.getUrl();
        return Estudio.count();
      })
      .then((t) => {

        console.log(t);
        assert.notEqual(totalEstudios, t);
      });
  });

});
