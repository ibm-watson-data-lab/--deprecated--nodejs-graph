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

// Necessary libs
var request = require('request');
var assert  = require('assert');
var _       = require('underscore');

// Global
var gds;

// Init
module.exports = exports = gds = function init(config) {

  // Validate config
  assert.equal(typeof config, 'object',
    'You must specify the endpoint url when invoking this module');
  assert.ok(/^https?:/.test(config.url), 'url is not valid');

  // Handle URL Requests
  function apiCall(opts) {
    if (!opts) var opts = {}

    // Force the URL
    opts.url = config.url + opts.url;

    // Auth
    opts.auth = {
      user: config.username,
      pass: config.password
    }

    return request(opts, function(error, response, body) {
      return console.log({
        error: error,
        response: response,
        body: body
      });
    })
  }

  /*
  Vertices
   */

  // Create Vertice
  function createVertices() {
  }

  // List Vertices
  function listVertices() {
    var opts = {
      url: '/vertices',
      method: 'GET'
    };
    return apiCall(opts);
  }

  var vertices = {
    create: createVertices,
    list: listVertices
  };

  /*
  Gremlin
   */

  // Gremlin Endpoint
  function gremlinQuery(traversal) {
    var opts = {
      url: '/gremlin',
      method: 'POST',
      json: true,
      body: '{"gremlin": ""}'
    }

    // If traveral is string
    if (_.isArray(traversal)) {
      // Check first element is g
      if (traversal[0] != 'g') {
        traversal.unshift('g');
      }

      opts.body = JSON.stringify({gremlin:traversal.join('.')});
    }
    else {
      opts.body = JSON.stringify({gremlin:traversal});
    }

    return apiCall(opts);
  }

  var gremlin = gremlinQuery;

  /*
  Input/Output
   */

  // Bulk Upload - GraphML
  function uploadGraphMl() {

  }

  //  Buld Upload - graphson
  function uploadGraphSON() {

  }

  // Extract
  function extractBulk(format) {
    if (!format) var format = 'json';

    var opts = {
      url: '/extract',
      headers: {
        'Content-Type': 'application/' + format
      }
    }

    return apiCall(opts);
  }

  var io = {
    bulkload: {
      graphml: uploadGraphMl,
      graphson: uploadGraphSON
    },
    extract: extractBulk
  }

  // Return object
  return {
    vertices: vertices,
    gremlin: gremlin,
    io: io
  }
}
