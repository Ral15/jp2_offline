const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const Seccion = require(path.join(__dirname , '../express-app/models/seccion.js'));
const config = require('../config.js');

const assert = chai.assert;
// Set the direction to launch the electron app.
var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const sectionsPath = path.join(__dirname, '..', 'db', 'seccion.db');
const dbUri = 'nedb://testDB';
const connect = require(path.join(__dirname , '../express-app/node_modules/camo')).connect;
let database;
// If the platform is win32, we use de .cmd to launch
// the app.
if (process.platform === 'win32') {
  electronPath += '.cmd';
}

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});

let deleteFolderRecursive = function(fPath) {
  if( fs.existsSync(fPath) ) {
    fs.readdirSync(fPath).forEach(function(file,index){
      var curPath = fPath + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(fPath);
  }
};

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

  before(async function(){
    await deleteFolderRecursive('./testDB');
    connect(dbUri).then((db) => {
      database = db;
    });

  });

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

    return client.waitForVisible('#username')
      .setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .waitForVisible('#datatable')
      .then(() => {
        return Seccion.count();
      })
      .then((total) => {
        assert.equal(total, 7)
      });
  });
});
