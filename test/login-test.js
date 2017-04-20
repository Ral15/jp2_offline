const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('../config.js');

const assert = chai.assert;
// Set the direction to launch the electron app.
let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
// If the platform is win32, we use de .cmd to launch
// the app.

if (process.platform === 'win32') {
  electronPath += '.cmd';
}

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

describe('Login Test', function() {
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

  // The time out to launch the app in the test.
  this.timeout(10000);

  // Before everything we launch the app.
  beforeEach(() => {
    // Launch the application
    this.app = new Application({ path: electronPath, args: ['.'] });
    return this.app.start();
  });

  // After test is complete we stop the app.
  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
    return null;
  });

  /**
  * Test Login form.
  *
  * Test if the login form is present in
  * application.
  */
  it('should show login form', () => {
    const client = this.app.client;
    return client.setValue('#username', config.username)
    .setValue('#password', config.password)
    .then(() => {
      return client.getValue('#username');
    }).then((usernameText) => {
      assert.equal(usernameText, config.username);
      return client.getValue('#password');
    })
    .then((passwordText) => {
      assert.equal(passwordText, config.password);
      return client.$('#submit-login');
    })
    .then((loginButton) => {
      assert.isNotNull(loginButton.value);
    });
  });

  /**
  * Test Login Successful.
  *
  * Test if the login is successful
  * in the application.
  */
  it('should login successful', () => {
    const client = this.app.client;
    return client.setValue('#username', config.username)
    .setValue('#password', config.password)
    .click('#submit-login')
    .then(() => {
      return client.waitForVisible('#nav_bar_user_name').getText('#nav_bar_user_name');
    }).then((usernameText) => {
      assert.equal(usernameText, config.username);
    });
  });

  /**
  * Test Login Fail.
  *
  * Test if the login fail
  * in the application.
  */
  it('should login fail', () => {
    const client = this.app.client;
    return client.setValue('#username', config.username)
    .setValue('#password', 'newpassword')
    .click('#submit-login')
    .then(() => {
      return client.waitForVisible('#error_message').getText('#error_message');
    }).then((error_message) => {
      assert.equal(error_message, 'Usuario o contraseña invalidos');
    });
  });
});
