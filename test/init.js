var GDS = require('../lib/client.js');
var should = require('should');

describe('Test config', function () {

  it('accepts valid config', function (done) {
    var g = new GDS({
      url: 'https://myurl.the.cloud.com/a/b/1',
      username: 'username',
      password: 'password',
    });
    g.should.be.an.Object;
    done();
  });

  it('rejects non-object', function (done) {
    should.throws(function () {
      var g = new GDS('');
    });

    done();
  });

  it('rejects missing url', function(done) {
    should.throws(function() {
      var g = new GDS({});
    });
    done();
  });

  it('should expose an API', function(done) {
    var g = new GDS({
      url: 'https://myurl.the.cloud.com/a/b/1',
      username: 'username',
      password: 'password',
    });
    g.should.be.an.Object;
    done();
  });

});

describe('Test API', function() {

  it('Test config & initial state', function(done) {
    var g = new GDS({
      url: 'https://myurl.the.cloud.com/a/b/1',
      username: 'username',
      password: 'password',
    });
    g.should.have.property('config');
    g.config.should.be.an.Object;
    g.gremlin.should.be.a.Function;
    g.io.should.be.a.Function;
    g.edges.should.be.a.Functon;
    g.schema.should.be.a.Function;
    g.session.should.be.a.Function;
    g.vertices.should.be.a.Function;
    g.index.should.be.a.Function;
    done();
  });

});
