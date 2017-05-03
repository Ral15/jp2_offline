const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Escuela = require(path.join(__dirname , '../express-app/models/escuela.js'));
const config = require('../config.js');

//Database connection
const connect = require(path.join(__dirname , '../express-app/node_modules/camo')).connect;
var database;
const dbUri = 'nedb://testDB';
//end DB connection

// Set the direction to launch the electron app.
let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
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

describe('Get Schools from API', function () {
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


  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
    });
    // end Database connection
  });

  // Before everything we launch the app.
  beforeEach(function () {
    // Launch the application
    this.app = new Application({ path: electronPath, args:['.'] });
    return this.app.start();
  });


  // After test is complete we stop the app.
  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  after(() => {
    //delete database
    return database.dropDatabase();
  });

  /**
  * Test get schools from API.
  *
  * Test if there are conection with API and get the schools to
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
        return Escuela.count();
      })
      .then((total) => {
        assert.equal(total, 2);
      });
  });
});
