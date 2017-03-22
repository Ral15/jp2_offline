var Application = require('spectron').Application;
const path = require('path');
var assert = require('assert');

// Set the direction to launch the electron app.
var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

// If the platform is win32, we use de .cmd to launch
// the app.
if (process.platform === 'win32') {
    electronPath += '.cmd';
}

// We launch the application
var app = new Application({ path: electronPath, args: ['.'] });

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

  //The time out to launch the app in the test.
  this.timeout(20000);

  // Before everything we launch the app.
  beforeEach(function () {
    return app.start();
  });

  // After test is complete we stop the app.
  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  /**
  * Test Application start.
  *
  * to show if the application starts without
  * problems.
  */
  it('shows an initial window', function () {
    return app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });

  /**
  * Test Login form.
  *
  * Test if the login form is present in
  * application.
  */
  it('should see login form', function () {
    var username = app.client.elementIdText('username');
    var password = app.client.elementIdText('password');
    var submit = app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('raul');
    password.keys('erikiado123');

    //click on signin button.
    submit.click()
      .then(() => done());
  });

  /**
  * Test Login Successful.
  *
  * Test if the login is successful
  * in the application.
  */
  it('should login successful', function () {
    var username = app.client.elementIdText('username');
    var password = app.client.elementIdText('password');
    var submit = app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepassword');

    //click on signin button
    submit.click();
    app.client.waitForText('Hola someusername')
      .then(() => done());
  });

  /**
  * Test Login Fail.
  *
  * Test if the login fail
  * in the application.
  */
  it('should login fail', function () {
    var username = app.client.elementIdText('username');
    var password = app.client.elementIdText('password');
    var submit = app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepasswordfail');

    //click on signin button
    submit.click();
    app.client.waitForText('Iniciar sesión')
      .then(() => done());
  });
});
