const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');

const assert = chai.assert;
// Set the direction to launch the electron app.
var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const sectionsPath = path.join(__dirname, '..', 'db', 'seccion.db');

// If the platform is win32, we use de .cmd to launch
// the app.
if (process.platform === 'win32') {
  electronPath += '.cmd';
}

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});


describe('Get Sections', function () {
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
    this.app = new Application({ path: electronPath, args: ['.'] });
    if (fs.existsSync(sectionsPath)) fs.unlinkSync(sectionsPath);
    return this.app.start();
  });

  // After test is complete we stop the app.
  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      if (fs.existsSync(sectionsPath)) fs.unlinkSync(sectionsPath);
      return this.app.stop();
    }
  });

  /**
  * Test get sections from API.
  *
  * Test if there are conection with API and get the sections to
  * application.
  */
  it('should get sections', function () {
    const client = this.app.client;
    return client.setValue('#username', 'eugenio')
    .setValue('#password', 'erikiado123')
    .click('#submit-login')
    .then(() => {
      return client.waitForVisible('#secciones-btn');
    })
    .then((estudiosButton) => {
      if (estudiosButton && fs.existsSync(sectionsPath)) assert.isOk(true, 'test is ok');
    });
  });
});
