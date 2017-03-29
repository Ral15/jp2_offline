const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
Browser.localhost('sjp2.com', 3000);

describe('User visits signup page', function () {

  const browser = new Browser({
    waitDuration: 29 * 1000,
  });

  describe('Visits homepage', function () {
    before(function (done) {
      browser.visit('/');
      done();
    });

    it('should redirect to the forgot page', function () {
      browser.assert.url({ pathname: '/' });
    });

    it('should see welcome page', function () {
      browser.assert.text('title', 'Welcome To Brains Depot');
    });
  });
});
