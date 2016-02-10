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
};

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

// Gremlin
gds.prototype.gremlin = function (traversal, callback) {
  var opts = {
    url: '/gremlin',
    method: 'POST',
    json: true,
  };

  // If traveral is string
  if (_.isArray(traversal)) {
    // Check first element is g
    if (traversal[0] !== 'g') {
      traversal.unshift('g');
    }

    opts.body = { gremlin: traversal.join('.') };
  } else {
    opts.body = { gremlin: traversal };
  }

  return this.apiCall(opts, callback);
};

// API Call
gds.prototype.apiCall = function (opts, callback) {
  if (!opts) { opts = {}; }

  var config = this.config;

  // Force the URL
  if (typeof opts.url === 'object') {
    opts.url = opts.url.baseURL + opts.url.url;
  } else {
    opts.url = config.url + opts.url;
  }

  // Auth
  if (config.session) {
    opts.headers = {
      Authorization: 'gds-token ' + config.session,
    };
  } else {
    opts.auth = {
      user: config.username,
      pass: config.password,
    };
  }

  // Debug Opts
  debug(opts);

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
    
    // force an error for non-200 responses
    if (response.statusCode != 200) {
      error = response.statusCode;
    }
    
    return callback(error, body);
  });
};

module.exports = gds;
