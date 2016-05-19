require('dotenv').load({ silent: true });

// environment variables
var APIURL = process.env.APIURL;
var USERNAME = process.env.USERNAME;
var PASSWORD =  process.env.PASSWORD;
if (!APIURL) {
  throw('Please set APIURL environment variable with the url of the IBM Graph instance');
}

if (!USERNAME || !PASSWORD) {
  throw('Please set USERNAME & PASSSWORD environment variables '
  + 'with the credentials of the IBM Graph instance');
}

// munge the URLs into pieces required by the library and by Nock
var url = require('url');
var parsed = url.parse(APIURL);
var PATH = parsed.pathname;
var STUB  = parsed.pathname.substr(0, (parsed.pathname.length - 2));
delete parsed.pathname;
var SERVER = url.format(parsed);

// sample response
var SAMPLE_RESPONSE = {
  requestId: '71e9b56e-bded-402e-8fac-cfc83aec9c31',
  status: {
    message: '',
    code: 200,
    attributes: {},
  },
  result: {
    data: null,
    meta: {},
  },
};

// load the GDS library and the http mocking library
var GDS    = require('../lib/client.js');
var nock   = require('nock');
var should = require('should');
var _      = require('underscore');
var uuid   = require('uuid');

describe('Authentication', function () {

  it('authenticates against session API - GET ../_session', function (done) {
    var mocks = nock(SERVER)
                .get(STUB + '/_session')
                .reply(200, { 'gds-token': 'x' });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD, session: 'broken-token' });

    g.session(function (err, data) {
      should(err).equal(null);
      data.should.be.a.String;
      mocks.done();
      done();
    });

  });

  it('fails to authenticate against session API - GET ../_session', function (done) {
    var mocks = nock(SERVER)
                .get(STUB + '/_session')
                .reply(403);

    var g = new GDS({ url: APIURL, username: 'badusername', password: PASSWORD });

    g.session(function (err, data) {
      err.should.be.equal(403);
      mocks.done();
      done();
    });

  });

});
