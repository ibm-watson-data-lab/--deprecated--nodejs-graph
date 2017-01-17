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

// Storage for the index name
var indexName = uuid.v4().replace(/\-/g, '');
var indexStatusName = uuid.v4().replace(/\-/g, '');

describe('Index', function () {
  it('retrieves a list of indexes - GET /index', function (done) {
    var mocks = nock(SERVER)
                .get(PATH + '/index')
                .reply(200, { graphs: ['g', 'foo'] });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD });

    g.index().get(function (err, data) {
      should(err).equal(null);
      data.should.be.an.Array;
      mocks.done();
      done();
    });

  });

  it('add new index', function (done) {
    var mocks = nock(SERVER)
                .post(PATH + '/index')
                .reply(201, { });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD });

    var index = {
      type: 'vertex',
      propertyKeys: [{
          name: 'takeAGuess',
          dataType: 'String',
          cardinality: 'SINGLE',
        },
      ],
      indexOnly: {
        name: 'person',
      },
      composite: true,
      name: indexName,
    };

    g.index().create(index, function (err, data) {
      should(err).equal(null);
      data.should.be.an.Object;
      mocks.done();
      done();
    });

  });

  it('get index', function (done) {
    var mocks = nock(SERVER)
                .get(PATH + '/index/' + indexName)
                .reply(201, { });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD });

    g.index().get(indexName, function (err, data) {
      should(err).equal(null);
      data.should.be.an.Object;
      mocks.done();
      done();
    });

  });

  it('deletes index', function (done) {
    var name = uuid.v1().replace(/\-/g, '');
    var mocks = nock(SERVER)
                .post(PATH + '/index')
                .reply(201, {})
                .delete(PATH + '/index/' + name)
                .reply(200, {});

    var index = {
      type: 'vertex',
      propertyKeys: [{
          name: 'name',
          dataType: 'String',
          cardinality: 'SINGLE',
        },
      ],
      indexOnly: {
        name: 'person',
      },
      composite: true,
      name: name,
    };

    var g = new GDS({
      url: APIURL,
      username: USERNAME,
      password: PASSWORD,
    });
    g.index().create(index, function (err, data) {
      should(err).equal(null);
      g.index().delete(name, function (err, data) {
        should(err).equal(null);
        data.should.be.an.Object;
        mocks.done();
        done();
      });
    });
  });

  it('check index status', function (done) {
    var mocks = nock(SERVER)
                .post(PATH + '/index')
                .reply(201, { })
                .get(PATH + '/index/' + indexStatusName + '/status')
                .reply(201, { });

    var g = new GDS({ url: APIURL, username: USERNAME, password: PASSWORD });

    var index = {
      type: 'vertex',
      propertyKeys: [{
          name: 'name',
          dataType: 'String',
          cardinality: 'SINGLE',
        }],
      indexOnly: {
        name: 'person',
      },
      composite: true,
      name: indexStatusName,
    };

    g.index().create(index, function (err, data) {
      should(err).equal(null);
      g.index().getStatus(indexStatusName, function (err, data) {
        should(err).equal(null);
        data.should.be.an.Object;
        mocks.done();
        done();
      });
    });

  });

  after(function (done) {

    var response = _.clone(SAMPLE_RESPONSE);
    response.result.data = [];
    var mocks = nock(SERVER)
                .delete(PATH + '/index/'+indexName)
                .reply(200, response)
                .delete(PATH + '/index/'+indexStatusName)
                .reply(200, response);

    var g = new GDS({
      url: APIURL,
      username: USERNAME,
      password: PASSWORD,
    });

    g.index().delete(indexName, function (err, data) {
      should(err).equal(null);
      g.index().delete(indexStatusName, function (err, data) {
        should(err).equal(null);
        data.should.be.an.Object;
        mocks.done();
        done();
      });
    });

  });

});
