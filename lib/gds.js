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
  function apiCall(opts, callback) {
    if (!opts) var opts = {}

    // Debug
    opts.debug = (config.debug) ? config.debug : ((!opts.debug) ? false : opts.debug);

    // Force the URL
    opts.url = config.url + opts.url;

    // Auth
    opts.auth = {
      user: config.username,
      pass: config.password
    }

    // Debug Opts
    if (opts.debug) console.log(opts);

    return request(opts, function(error, response, body) {
      var returnObject = {
        error: error,
        response: response,
        body: body
      };

      if (opts.debug) console.log(returnObject);

      if (!callback) {
        return returnObject;
      }

      return callback(error, response, body)
    })
  }

  /*
  Vertices
   */

  // Create Vertice
  function createVertices(keyPairs, callback) {
    var opts = {
      url: '/vertices',
      method: 'POST'
    }
    return apiCall(opts, callback);
  }

  // List Vertices
  function listVertices(callback) {
    var opts = {
      url: '/vertices',
      method: 'GET'
    };
    return apiCall(opts, callback);
  }

  // Vertex by ID
  function vertexById(id, callback) {
    var opts = {
      url: '/vertices/' + id,
      method: 'GET'
    }
    return apiCall(opts, callback);
  }

  // Vertex by properties
  function vertexByProperties(properties, callback) {
    var opts = {
      url: '/vertices',
      method: 'GET',
      qs: properties
    }
    return apiCall(opts, callback);
  }

  var vertices = {
    create: createVertices,
    list: listVertices,
    get: vertexById,
    properties: vertexByProperties
  };

  /*
  Gremlin
   */

  // Gremlin Endpoint
  function gremlinQuery(traversal, callback) {
    var opts = {
      url: '/gremlin',
      method: 'POST',
      // @TODO: reimplement later
      // json: true,
      body: '{"gremlin": ""}',
      headers: {
        'Content-Type': 'application/json'
      }
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

    return apiCall(opts, callback);
  }

  var gremlin = gremlinQuery;

  /*
  Input/Output
   */

  // Bulk Upload - GraphML
  function uploadGraphMl(graphml, callback) {

    if (typeof graphml != 'string' && !callback) var callback = graphml;

    var opts = {
      url: '/bulkload/graphml',
      method: 'POST',
      form: {graphml: graphml}
    }
    return apiCall(opts, callback);
  }

  //  Buld Upload - graphson
  function uploadGraphSON(graphson, callback) {

    if (typeof graphson != 'string' && !callback) var callback = graphson;

    var opts = {
      url: '/bulkload/graphson',
      method: 'POST',
      form: {graphson: graphson}
    }
    return apiCall(opts, callback);
  }

  // Extract
  function extractBulk(format, callback) {

    if (!callback) var callback = format;
    if (!format) var format = 'json';

    var opts = {
      url: '/extract',
      method: 'GET',
      headers: {
        'Content-Type': 'application/' + format
      }
    }

    return apiCall(opts, callback);
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
