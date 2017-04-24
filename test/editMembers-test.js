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


describe('Edit member test', function () {
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
          estadoCivil: 'Soltero',
          calle: 'Erizo',
          colonia: 'Fs',
          codigoPostal: 76150,
          localidad: 'Otro',
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
  * Test editMember
  *
  * Test if the edit-member button exists in the
  * members view.
  */
  it('should see edit member button for members', async function () {
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
        return client.$('#edit-member-button-' + tutor._id);
      })
      .then((editTutorBtn) => {
        assert.isNotNull(editTutorBtn.value);
        return client.$('#edit-member-button-' + student._id); 
      })
      .then((editStudentBtn) => {
        assert.isNotNull(editStudentBtn.value);
      });
  });
  /**
  * Test load inputs with Tutor data
  *
  * Test if you can load form with tutor data
  */
  it('should show values of saved Tutor', async function () {
    const client = this.app.client;
    const editModal = '#editMemberModal-' + tutor._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#edit-member-button-' + tutor._id)
      .waitForVisible(editModal)
      .$(editModal + ' #role').getValue()
      .then((roleValue) => {
        assert.equal(roleValue, tutor.relacion);
        return client.$(editModal + ' #job').getValue();
      })
      .then((jobValue) => {
        assert.equal(jobValue, tutor.oficio);
        return client.getValue(editModal + ' #firstName');
      })
      .then((firstNameValue) => {
        assert.equal(firstNameValue, tutor.nombres)
        return client.getValue(editModal + ' #lastName');
      })
      .then((lastNameValue) => {
        assert.equal(lastNameValue, tutor.apellidos);
        return client.getValue(editModal + ' #phone');
      })
      .then((phoneValue) => {
        assert.equal(phoneValue, tutor.telefono);
        return client.getValue(editModal + ' #email');
      })
      .then((emailValue) => {
        assert.equal(emailValue, tutor.correo);
        return client.$(editModal + ' #academicDegree').getValue();
      })
      .then((academicValue) => {
        assert.equal(academicValue, tutor.nivelEstudios);
        return client.getValue(editModal + ' #birthDate');
      })
      .then((bitrhValue) => {
        assert.equal(bitrhValue, tutor.fechaNacimiento)
      })
  });
  /**
  * Test load inputs with Student data
  *
  * Test if you can load form with Student data
  */
  it('should show values of saved Student', async function () {
    const client = this.app.client;
    const editModal = '#editMemberModal-' + student._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#edit-member-button-' + student._id)
      .waitForVisible(editModal)
      .$(editModal + ' #role').getValue()
      .then((roleValue) => {
        assert.equal(roleValue, student.relacion);
        return client.$(editModal + ' #job').getValue();
      })
      .then((jobValue) => {
        assert.equal(jobValue, student.oficio);
        return client.getValue(editModal + ' #firstName');
      })
      .then((firstNameValue) => {
        assert.equal(firstNameValue, student.nombres)
        return client.getValue(editModal + ' #lastName');
      })
      .then((lastNameValue) => {
        assert.equal(lastNameValue, student.apellidos);
        return client.getValue(editModal + ' #phone');
      })
      .then((phoneValue) => {
        assert.equal(phoneValue, student.telefono);
        return client.getValue(editModal + ' #email');
      })
      .then((emailValue) => {
        assert.equal(emailValue, student.correo);
        return client.$(editModal + ' #academicDegree').getValue();
      })
      .then((academicValue) => {
        assert.equal(academicValue, student.nivelEstudios);
        return client.getValue(editModal + ' #birthDate');
      })
      .then((bitrhValue) => {
        assert.equal(bitrhValue, student.fechaNacimiento);
        return client.getValue(editModal + ' #school');
      })
      .then((schoolValue) => {
        assert.equal(schoolValue, student.escuela);
        return client.getValue(editModal + ' #sae');
      })
      .then((saeValue) => {
        assert.equal(saeValue, student.sae);
      });
  });
/**
  * Test edit Tutor values
  *
  * Test if you can edit a member
  */
  it('should edit tutor ', async function () {
    const client = this.app.client;
    const editModal = '#editMemberModal-' + tutor._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#edit-member-button-' + tutor._id)
      .waitForVisible(editModal)
      .$(editModal + ' #job').selectByAttribute('value', 'empleado/a')
      .setValue(editModal + ' #firstName', 'El nuevo vato')
      .setValue(editModal + ' #lastName', 'PicaranasAhora')
      .setValue(editModal + ' #phone', '5524181818')
      .setValue(editModal + ' #email', 'erikiad@gmgmgi.com')
      .$(editModal + ' #academicDegree').selectByAttribute('value', '6_grado')
      .setValue(editModal + ' #birthDate', '1990-12-01')
      .click('#submit-member-' + tutor._id)
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.find({_id: tutor._id});
      })
      .then(async (newMember) => {
        assert.notEqual(tutor.oficio, newMember.oficio);
        assert.notEqual(tutor.nombres, newMember.nombres);
        assert.notEqual(tutor.apellidos, newMember.apellidos);
        assert.notEqual(tutor.telefono, newMember.telefono);
        assert.notEqual(tutor.correo, newMember.correo);
        assert.notEqual(tutor.nivelEstudios, newMember.nivelEstudios);
        assert.notEqual(tutor.fechaNacimiento, newMember.fechaNacimiento);
      });
  });
/**
  * Test edit Student values
  *
  * Test if you can edit a student
  */
  it('should edit estudiante ', async function () {
    const client = this.app.client;
    const editModal = '#editMemberModal-' + student._id;
    return client.setValue('#username',config.username)
      .setValue('#password', config.password)
      .click('#submit-login')
      .click('#edit-estudio-' + estudioId)
      .waitForVisible('#street')
      .click('#create-family')
      .waitForVisible('#members-section')
      .click('#edit-member-button-' + student._id)
      .waitForVisible(editModal)
      .setValue(editModal + ' #sae', '00000')
      .$(editModal + ' #school').selectByAttribute('value', 'Plantel Buenavista')
      .$(editModal + ' #job').selectByAttribute('value', 'empleado/a')
      .setValue(editModal + ' #firstName', 'NuevoMorro')
      .setValue(editModal + ' #lastName', 'PicaranasAhora')
      .setValue(editModal + ' #phone', '5524181818')
      .setValue(editModal + ' #email', 'erikiad@gmgmgi.com')
      .$(editModal + ' #academicDegree').selectByAttribute('value', '6_grado')
      .setValue(editModal + ' #birthDate', '1990-12-01')
      .click('#submit-member-' + student._id)
      .waitForVisible('#members-section')
      .then(() => {
        return connect(dbUri);
      })
      .then((db) => {
        return Miembro.find({_id: student._id});
      })
      .then(async (newMember) => {
        assert.notEqual(student.oficio, newMember.oficio);
        assert.notEqual(student.nombres, newMember.nombres);
        assert.notEqual(student.apellidos, newMember.apellidos);
        assert.notEqual(student.telefono, newMember.telefono);
        assert.notEqual(student.correo, newMember.correo);
        assert.notEqual(student.nivelEstudios, newMember.nivelEstudios);
        assert.notEqual(student.fechaNacimiento, newMember.fechaNacimiento);
      });
  });   
});
