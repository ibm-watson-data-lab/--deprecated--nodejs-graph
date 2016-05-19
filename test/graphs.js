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

describe('Graphs', function () {
  it('retrieves a list of graphs - GET /_graphs', function (done) {
    var mocks = nock(SERVER)
                .get(STUB + '/_graphs')
                .reply(200, { graphs: ['g', 'foo'] });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD, session: 'broken-token' });

    g.graphs().get(function (err, data) {
      should(err).equal(null);
      data.should.be.an.Array;
      mocks.done();
      done();
    });

  });

  it('adds new graphs', function (done) {
    var mocks = nock(SERVER)
                .post(STUB + '/_graphs')
                .reply(201, { graphId: 'foo', dbUrl: 'https://example.com/user/foo' });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD, session: 'broken-token' });

    g.graphs().create(function (err, data) {
      should(err).equal(null);
      data.should.be.an.Object;
      data.dbUrl.should.be.a.String;
      data.graphId.should.be.a.String;
      mocks.done();
      done();
    });

  });

  it('deletes graphs', function (done) {
    var name = uuid.v1();
    var mocks = nock(SERVER)
                .delete(STUB + '/_graphs/' + name)
                .reply(200, {})
                .post(STUB + '/_graphs/' + name)
                .reply(201, { graphId: 'foo', dbUrl: 'https://example.com/user/foo' });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD, session: 'broken-token' });
    g.graphs().create(name, function (err, data) {
      should(err).equal(null);
      g.graphs().delete(name, function (err, data) {
        should(err).equal(null);
        data.should.be.an.Object;
        mocks.done();
        done();
      });
    });
  });

});
