var Application = require('spectron').Application;
var assert = require('assert');

describe('application launch', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: '../jp2-win32-x64/jp2.exe'
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2);
    });
  });

  it('should see login form', function () {
    var username = this.app.client.elementIdText('username');
    var password = this.app.client.elementIdText('password');
    var submit = this.app.client.element('//button/*[text(),Iniciar sesión]');
    username.keys('someusername');
    password.keys('somepassword');

    //click on signin button
    submit.click();
  });
});
