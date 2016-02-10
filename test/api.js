require('dotenv').config();

// environment variables
var APIURL = process.env.APIURL;
var USERNAME = process.env.USERNAME;
var PASSWORD =  process.env.PASSWORD;
if (!APIURL) {
  throw('Please set APIURL environment variable with the url of the Graph Data Store instance');
}
if (!USERNAME || !PASSWORD) {
  throw('Please set USERNAME & PASSSWORD environment variables with the credentials of the Graph Data Store instance');
}

// munge the URLs into pieces required by the library and by Nock
var url = require('url');
var parsed = url.parse(APIURL);
var STUB  = parsed.pathname.substr(0, (parsed.pathname.length - 2));
delete parsed.pathname;
var SERVER = url.format(parsed);


// load the GDS library and the http mocking library
var GDS = require('../lib/gds.js');
var nock = require('nock');


describe('Authentication', function() {
  
  it('calls session API - GET ../_session', function(done) {
    var mocks = nock(SERVER)
                .get(STUB + '/_session')
                .reply(200, {'gds-token': 'x'});

    var g = new GDS({url: APIURL, username: USERNAME, password: PASSWORD});
   
    g.session(function(data) {
      //should(err).equal(null);
      data.should.be.a.String;
      mocks.done();
      done();
    });
    
  });
});