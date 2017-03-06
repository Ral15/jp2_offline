# How to do a test

This How to do guide helps to do a test launching the application:

* [Spectron](https://github.com/electron/spectron)
* [Mocha](https://mochajs.org/)

# Table of contents

1. [Preparing Test](#Preparing Test)
  1. [Install Spectron](#Install Spectron)
  2. [Install Mocha](#Install Mocha)
  3. [Deploy the application](#Deploy the application)
2. [Test](#Test)
  1. [Add the application in Test](#Add the application in Test)
4. [Testing](#Testing)

# Preparing Test

## Install Spectron

* For the test you need Spectron to do a test

  ```shell

  $ npm install --save-dev spectron

  ```
## Install Mocha

* Also you need to install mocha for the test, mocha comes with spectron as default.
  But if doesn't run you can do a npm install

  ```shell

  $ npm install mocha

  ```

## Deploy the application

* You need to have a executable file, it depends what you have as Operative System
  for more information you can see [electron-packager](https://github.com/electron-userland/electron-packager):

  ```shell

  $ electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional falgs...]

  ```

# Test

* This is an example of test file

  ```shell

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


  ```

## Add the application in Test

* Add the path of your application, the following example is for windows

  ```shell

  path: '../jp2-win32-x64/jp2.exe'

  ```

# Testing

* For testing your code:

  ```shell

  $ npm test

  ```
