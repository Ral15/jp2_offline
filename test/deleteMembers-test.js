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


describe('Delete members test', function () {
  /**
  * Integration test suite for testing the Edition of members.
  *
  * Test if the edition of members works correctly in the app.
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
  let tutor;
  let student;
  before(() => {
    //connect to db
    connect(dbUri).then((db) => {
      database = db;
      //create family object
      let f = Familia.create({
          bastardos: 10,
          estadoCivil: 'soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'otro',
          nombreFamilia: 'Los Picapiedras',        
      });
      //save family
      return f.save();
    })
    .then((newFamily) => {
      //save familyId
      familyId = newFamily._id;
      //create estudio 
      let e = Estudio.create({
        tokenCapturista: config.apiToken,
        familia: newFamily,
      });  
      //save studio 
      return e.save();
    })
    .then((newEstudio) => {
      //save estudioId
      estudioId = newEstudio._id;
      //create tutor object
      let tutor = Miembro.create({
        familyId: familyId,
        nombres: 'Pepe',
        apellidos: 'Picapiedras',
        telefono: '44227270873',
        correo: 'pepe@picapepe.com',
        fechaNacimiento: '2010-09-10',
        oficio: 'albañil',
        observacionOficio: 'le da recio',
        sae: '',
        relacion: 'tutor',
        escuela: '',
        observacionEscuela: '',
      });
      //save tutor
      return tutor.save();
    })
    .then((newTutor) => {
      //save tutor object
      tutor = newTutor;
      //create student object
      let estudiante = Miembro.create({
        familyId: familyId,
        nombres: 'Morrito',
        apellidos: 'Picapiedras',
        telefono: '44227270873',
        correo: 'pepe@morropepe.com',
        fechaNacimiento: '2000-09-10',
        oficio: '',
        observacionOficio: '',
        sae: '15090',
        relacion: 'estudiante',
        escuela: 'Plantel Jurica',
        observacionEscuela: 'va mucho',
      });
      //save student
      return estudiante.save();
    })
    .then((newStudent) => {
      //save student object
      student = newStudent;
      return Miembro.count({familyId: familyId});
    })
    .then((count) => {
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
  * Test delete Member
  *
  * Test if the edit-member button exists in the
  * members view.
  */
  it('should see delete member button for members', async function () {
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
        return client.$('#delete-member-' + tutor._id);
      })
      .then((editTutorBtn) => {
        assert.isNotNull(editTutorBtn.value);
        return client.$('#delete-member-' + student._id);
      })
      .then((editStudentBtn) => {
        assert.isNotNull(editStudentBtn.value);
      });
  });
/**
  * Test delete member
  *
  * This test will check if a modal shows before deleting a member
  */
  it('should see modal before deleting a member', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#delete-member-' + tutor._id)
      .waitForVisible('.swal2-container')
      .then(async () => {
        await sleep(1000);
        return client.getText('#swal2-content');
      })
      .then((modalText) => {
        assert.equal(modalText, 'No podras recuperar al miembro después de esta acción.');
      });
  });
  /**
  * Test delete member
  *
  * This test will cancel the modal
  */
  it('should cancel delete member sweetalert2', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#delete-member-' + tutor._id)
      .waitForVisible('.swal2-container')
      .click('.swal2-cancel')
      .then(async () => {
        await sleep(1000);
        return client.$('#delete-member-' + tutor._id);
      })
      .then((estudioButton) => {
        assert.isNotNull(estudioButton.value);
      });
  });
/**
  * Test delete member
  *
  * This test will delete a member
  */
  it('should delete member', async function () {
    const client = this.app.client;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#delete-member-' + tutor._id)
      .waitForVisible('.swal2-container')
      .click('.swal2-confirm')
      .then(async() => {
        await sleep(1000);
        return client.click('.swal2-confirm');
      })
      .then(() => {
        return client.waitForVisible('#members-section');
      })
      .then(() => {
        return client.$('#delete-member-' + tutor._id);
      })
      .then((buttnValue) => {
        assert.isNull(buttnValue.value);
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.count({_id: student._id});
      })
      .then((totalCount) => {
        assert.isBelow(totalCount, totalMembers);
      })
  });
});
