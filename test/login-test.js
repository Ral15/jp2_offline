const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const assert = chai.assert;
// Set the direction to launch the electron app.
let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
// If the platform is win32, we use de .cmd to launch
// the app.

if (process.platform === 'win32') {
  electronPath += '.cmd';
}

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});

describe('Login Test', function () {
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
  beforeEach(function () {
    // Launch the application
    this.app = new Application({ path: electronPath, args: ['.'] });
    return this.app.start();
  });

  // After test is complete we stop the app.
  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  /**
  * Test Login form.
  *
  * Test if the login form is present in
  * application.
  */
  it('should show login form', function () {
    const client = this.app.client;
    return client.setValue('#username', 'usuario_prueba')
    .setValue('#password', 'contrasena')
    .then(() => {
      return client.getValue('#username');
    }).then((usernameText) => {
      assert.equal(usernameText, 'usuario_prueba');
      return client.getValue('#password');
    })
    .then((passwordText) => {
      assert.equal(passwordText, 'contrasena');
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
  it('should login successful', function () {
    const username = this.app.client.elementIdText('username');
    const password = this.app.client.elementIdText('password');
    const submit = this.app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepassword');

    // click on signin button
    submit.click();
    this.app.client.waitForText('Hola someusername').then(() => done());
  });

  /**
  * Test Login Fail.
  *
  * Test if the login fail
  * in the application.
  */
  it('should login fail', function () {
    const username = this.app.client.elementIdText('username');
    const password = this.app.client.elementIdText('password');
    const submit = this.app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepasswordfail');

    // click on signin button
    submit.click();
    this.app.client.waitForText('Iniciar sesión').then(() => done());
  });
});
