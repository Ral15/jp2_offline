const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const assert = chai.assert;
// Set the direction to launch the electron app.
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

// If the platform is win32, we use de .cmd to launch
// the app.
if (process.platform === 'win32') {
  electronPath += '.cmd';
}

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});

var app = new Application({ path: electronPath });

describe('Get Sections' + electronPath, function () {
  /**
  * Integration test suite for testing get sections.
  *
  * Test if get the sections from API works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  // The time out to launch the app in the test.
  this.timeout(20000);

  // Before everything we launch the app.
  beforeEach(function () {
    // Launch the application
    return app.start();
  });

  // After test is complete we stop the app.
  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  /**
  * Test get sections from API.
  *
  * Test if there are conection with API and get the sections to
  * application.
  */
  it('should get sections', function () {
    const username = app.client.elementIdText('username');
    const password = app.client.elementIdText('password');
    const submit = app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepassword');

    // click on signin button
    submit.click();
    app.client.waitForText('Hola someusername').then(() => done());
  });
});
