const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const Estudio = require(path.join(__dirname , '../express-app/models/estudio.js'));
const Familia = require(path.join(__dirname , '../express-app/models/familia.js'));
const Miembro = require(path.join(__dirname , '../express-app/models/miembro.js'));
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


describe('Create Members test', function () {
  /**
  * Integration test suite for testing the Creation of members.
  *
  * Test if the creation of members works correctly in the app.
  *
  * Attributes
  * ----------
  * application: spectron
  *   Driver to launch the application.
  */

  //The time out to launch the app in the test.
  this.timeout(10000);

  let totalMembers;
  let estudioId;
  let familyId;

  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
      //create family
      let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'otro',
          nombreFamilia: 'Los Picapiedras',        
      });
      return f.save();
    })
    .then((newFamily) => {
      //save familyId
      familyId = newFamily._id;
      //create estudio 
      let e = Estudio.create({
        //change later for config
        tokenCapturista: config.apiToken,
        familia: newFamily,
      });   
      return e.save();   
    })
    .then((newEstudio) => {
      estudioId = newEstudio._id;
      return Miembro.find({familyId: familyId});
    })
    .then((count) => {
      console.log(count);
      totalMembers = count;
    })
    .catch((err) => {
      console.log(err);
    });
    // end Database connection
  });

  // Before everything we launch the app.
  beforeEach(async function () {
    // Launch the application
    this.app = new Application({ path: electronPath, args:['.'] });
    return this.app.start();
  });


  // After test is complete we stop the app.
  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  after(() => {
    //delete database
    return database.dropDatabase();
  });
  /**
  * Test AddMember
  *
  * Test if the add-member button exists in the
  * members view.
  */
  it('should see addMember button', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .then(() => {
        return client.$('#add-member-button');
      })
      .then((addMemberBtn) => {
        assert.isNotNull(addMemberBtn.value);
      });
  });
  /**
  * Test fill addMember modal
  *
  * Test if you can fill the addMember modal
  */
  it('should fill addMember modal', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '4422727084')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.$('#role').getValue();
      })
      .then((roleValue) => {
        assert.equal(roleValue, 'madre');
        return client.$('#job').getValue();
      })
      .then((jobValue) => {
        assert.equal(jobValue, 'albañil');
        return client.getValue('#firstName');
      })
      .then((firstNameValue) => {
        assert.equal(firstNameValue, 'Pepe')
        return client.getValue('#lastName');
      })
      .then((lastNameValue) => {
        assert.equal(lastNameValue, 'PicaPiedras');
        return client.getValue('#phone');
      })
      .then((phoneValue) => {
        assert.equal(phoneValue, '4422727084');
        return client.getValue('#email');
      })
      .then((emailValue) => {
        assert.equal(emailValue, 'raul@mien.com');
        return client.$('#academicDegree').getValue();
      })
      .then((academicValue) => {
        assert.equal(academicValue, '1_grado');
        return client.getValue('#birthDate');
      })
      .then((bitrhValue) => {
        assert.equal(bitrhValue, '2006-12-01')
      })
  });  
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO role', async function () {
    const client = this.app.client;
    // await sleep(500);
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', '')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '4422727084')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });  
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO firstName', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', '')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '4422727084')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO lastName', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', '')
      .setValue('#phone', '4422727084')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO phone', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO email', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '4422727083')
      .setValue('#email', '')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO academicDegree', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '442727272')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '')
      .setValue('#birthDate', '2006-12-01')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test error at filling addMember modal
  *
  * Test if you can't submit the add member form
  */
  it('should fill form with NO bitrhValue', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#myModalLabel')
      .$('#role').selectByAttribute('value', 'madre')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Pepe')
      .setValue('#lastName', 'PicaPiedras')
      .setValue('#phone', '442727272')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#birthDate', '')
      .then(() => {
        return client.getAttribute('#submit-addMember-form', 'class');
      })
      .then((buttonAttributes) => {
        assert(buttonAttributes.split(' ').indexOf('disabled') != -1);
      });      
  });
/**
  * Test creating of a member
  *
  * Test if you can create a member
  */
  it('should submit & create a member with role Tutor', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#addMemberSection')
      .$('#role').selectByAttribute('value', 'tutor')
      .$('#job').selectByAttribute('value', 'albañil')
      .setValue('#firstName', 'Papa')
      .setValue('#lastName', 'PicaPiedra')
      .setValue('#phone', '442727272')
      .setValue('#email', 'raul@mien.com')
      .$('#academicDegree').selectByAttribute('value', 'doctorado')
      .setValue('#birthDate', '2006-12-01')
      .click('#submit-addMember-form')
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.count({familyId: familyId});
      })
      .then((newTotal) => {
        assert.isBelow(totalMembers, newTotal);
        totalMembers ++;
      });
  });
/**
  * Test creating of a member
  *
  * Test if you can create a member
  */
  it('should submit & create a member with role Madre', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#memberModal #myModalLabel')
      .$('#memberModal #role').selectByAttribute('value', 'madre')
      .$('#memberModal #job').selectByAttribute('value', '')
      .setValue('#memberModal #firstName', 'Mama')
      .setValue('#memberModal #lastName', 'PicaPiedra')
      .setValue('#memberModal #phone', '442727272')
      .setValue('#memberModal #email', 'raul@mien.com')
      .$('#memberModal #academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#memberModal #birthDate', '2006-12-01')
      .click('#submit-addMember-form')
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.count({familyId: familyId});
      })
      .then((newTotal) => {
        assert.isBelow(totalMembers, newTotal);
        totalMembers ++;
      });
  });
/**
  * Test creating of a member with role 'Estudiante'
  *
  * Test if you can create a member
  */
  it('should submit & create a member with role Estudiante', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#add-member-button')
      .waitForVisible('#memberModal #myModalLabel')
      .$('#memberModal #role').selectByAttribute('value', 'estudiante')
      .$('#memberModal #school').selectByAttribute('value', 'Plantel Jurica')
      .setValue('#memberModal #sae', '1598')
      .$('#memberModal #job').selectByAttribute('value', '')
      .setValue('#memberModal #firstName', 'Morro')
      .setValue('#memberModal #lastName', 'PicaPiedras')
      .setValue('#memberModal #phone', '442727272')
      .setValue('#memberModal #email', 'raul@mien.com')
      .$('#memberModal #academicDegree').selectByAttribute('value', '1_grado')
      .setValue('#memberModal #birthDate', '2006-12-01')
      .click('#submit-addMember-form')
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.count({familyId: familyId});
      })
      .then((newTotal) => {
        assert.isBelow(totalMembers, newTotal);
      });
  });
});
