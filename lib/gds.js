// Licensed under the Apache License, Version 2.0 (the 'License'); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

'use strict';

// Necessary Dependencies
var assert  = require('assert');
var _       = require('underscore');
var request = require('request');
var debug = require('debug')('gds-wrapper');

// Global
function gds(config) {
  // Validate config
  assert.equal(typeof config, 'object',
    'You must specify the endpoint url when invoking this module');
  assert.ok(/^https?:/.test(config.url), 'url is not valid');

  this.config = config;

  return this;
}

// Session
gds.prototype.session = require('./session');

// Schema
gds.prototype.schema = require('./schema');

// Vertices
gds.prototype.vertices = require('./vertices');

// Edges
gds.prototype.edges = require('./edges');

// IO
gds.prototype.io = require('./io');

// Index
gds.prototype.index = require('./index');

// Graphs
gds.prototype.graphs = require('./graphs');

// Gremlin
gds.prototype.gremlin = function (traversal, callback) {
  var opts = {
    url: '/gremlin',
    method: 'POST',
    json: true,
    body: {
      gremlin: '',
      bindings: '',
    },
  };

  // If traveral is string
  if (_.isObject(traversal)) {
    //  If an Object, map the gremlin query in
    if (traversal.gremlin) {
      opts.body.gremlin = traversal.gremlin;
    }

    // Add the bindings for said gremlin
    if (traversal.bindings) {
      opts.body.bindings = traversal.bindings;
    }
  } else if (_.isArray(traversal)) {
    // If processing an array, stringify
    opts.body.gremlin = traversal.join('.');
  } else {
    // Straigh pass
    opts.body.gremlin = traversal;
  }

  return this.apiCall(opts, callback);
};

// API Call
gds.prototype.apiCall = function (opts, callback) {
  if (!opts) { opts = {}; }

  var config = this.config;

  // Auth
  if (config.session && typeof opts.url.url === 'undefined') {
    opts.headers = {
      Authorization: 'gds-token ' + config.session,
    };
  } else {
    opts.auth = {
      user: config.username,
      pass: config.password,
    };
  }

  // Force the URL
  if (typeof opts.url === 'object') {
    opts.url = opts.url.baseURL + opts.url.url;
  } else if (opts.url.substr(0, 4) !== 'http') {
    opts.url = config.url + opts.url;
  }

  // Debug Opts
  debug(opts);

  var _this = this;

  return request(opts, function (error, response, body) {

    var returnObject = {
      error: error,
      response: response,
      body: body,
    };

    debug(returnObject);

    if (!callback) {
      return returnObject;
    }

    // force an error for non-2XX responses
    if (!error && response && (response.statusCode < 200 || response.statusCode >=300)) {
      error = response.statusCode;
    }

    // Reload Session
    if (config.session && error === 403) {
      console.log('Bad session, reload');
      _this.session(function (err, body) {
        _this.config.session = body;
        _this.apiCall(opts, callback);
      });
    } else {
      return callback(error, body);
    }
  });
};

module.exports = gds;
