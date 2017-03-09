var Application = require('spectron').Application;
const path = require('path');
var assert = require('assert');

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var app = new Application({ path: electronPath });

describe('application launch', function () {
  this.timeout(20000);

  beforeEach(function () {
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', function () {
    return app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });

  it('should see login form', function () {
    var username = app.client.elementIdText('username');
    var password = app.client.elementIdText('password');
    var submit = app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepassword');

    //click on signin button
    submit.click()
      .then(() => done());
  });

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
