// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var server = require('../app');
// var should = chai.should();
// const Browser = require('zombie');

// chai.use(chaiHttp);


// describe('Express', function() {
// 	it('should open the app', function(done) {
// 	  chai.request(server)
// 	    .get('/')
// 	    .end(function(err, res){
// 	      res.should.have.status(200);
// 	      // console.log(err)
// 	      // console.log(res)
// 	      done();
// 	    });

// 		// done();
// 	});
// 	it('should log user', function(done) {
// 		chai.request(server)
// 		.post('/user/login/')
// 		.send({ 'username': 'erikiano', 'password': 'vacalalo' })
// 		.end(function(err, res) {
// 			res.should.have.status(200);
// 		    // res.body.SUCCESS.should.be.a('object');
// 			console.log(res.body)
// 			done();
// 		})
// 	});

//   // it('should list a SINGLE blob on /blob/<id> GET');
//   // it('should add a SINGLE blob on /blobs POST');
//   // it('should update a SINGLE blob on /blob/<id> PUT');
//   // it('should delete a SINGLE blob on /blob/<id> DELETE');
// });

// const Browser = require('zombie');

// // We're going to make requests to http://example.com/signup
// // Which will be routed to our test server localhost:3000
// Browser.localhost('sjp2.com', 3000);

// describe('User visits signup page', function() {

//   const browser = new Browser({
//   	waitDuration: 29*1000
//   });

// 	describe('Visits homepage', function() {
//         before(function(done) {
//             browser.visit('/');
//             done();
//         });

//         it('should redirect to the forgot page', function() {
//             browser.assert.url({pathname: '/'});
//         });

//         it('should see welcome page', function() {
// 	      browser.assert.text('title', 'INICIA SESIÓN');
// 	    });
// 	});
// });
