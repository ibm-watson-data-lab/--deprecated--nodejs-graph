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
var assert = require('assert');
var _      = require('underscore');

// Global
var gds;

// Init
module.exports = exports = gds = function init(config) {

  // Validate config
  assert.equal(typeof config, 'object',
    'You must specify the endpoint url when invoking this module');
  assert.ok(/^https?:/.test(config.url), 'url is not valid');

  // Local Libs
  var utils = require('./utils')(config);

  /*
  Vertices
   */

  // Create Vertice
  function createVertices(keyPairs, callback) {
    var opts = {
      url: '/vertices',
      method: 'POST',
    };
    if (typeof callback === 'undefined') {
      callback = keyPairs;
    } else {
      opts.json = true;
      opts.body = keyPairs;
    }

    return utils.apiCall(opts, callback);
  }

  // List Vertices
  function listVertices(callback) {
    var opts = {
      url: '/vertices',
      method: 'GET',
    };
    return utils.apiCall(opts, callback);
  }

  // Vertex by ID
  function vertexById(id, callback) {
    var opts = {
      url: '/vertices/' + id,
      method: 'GET',
    };
    return utils.apiCall(opts, callback);
  }

  // Vertex by properties
  function vertexByProperties(properties, callback) {
    var opts = {
      url: '/vertices',
      method: 'GET',
      qs: properties,
    };
    return utils.apiCall(opts, callback);
  }

  var vertices = {
    create: createVertices,
    list: listVertices,
    get: vertexById,
    properties: vertexByProperties,
  };

  /*
  Edges
   */

  // Create Edge
  function createEdge(label, outV, inV, callback) {
    var opts = {
      url: '/edges',
      method: 'POST',
      json: true,
      body: {
        label: label,
        outV: outV,
        inV: inV,
      },
    };
    return utils.apiCall(opts, callback);
  }

  // List Edges
  function listEdges(callback) {
     var opts = {
       url: '/edges',
       method: 'GET',
     };
     return utils.apiCall(opts, callback);
   }

  // Edge by ID
  function edgeById(id, callback) {
     var opts = {
       url: '/edges/' + id,
       method: 'GET',
     };
     return utils.apiCall(opts, callback);
   }

  var edges = {
     create: createEdge,
     list: listEdges,
     get: edgeById,
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
        'Content-Type': 'application/json',
      },
    };

    // If traveral is string
    if (_.isArray(traversal)) {
      // Check first element is g
      if (traversal[0] !== 'g') {
        traversal.unshift('g');
      }

      opts.body = JSON.stringify({ gremlin:traversal.join('.') });
    } else {
      opts.body = JSON.stringify({ gremlin:traversal });
    }

    return utils.apiCall(opts, callback);
  }

  var gremlin = gremlinQuery;

  /*
  Input/Output
   */

  // Bulk Upload - GraphML
  function uploadGraphMl(graphml, callback) {

    if (typeof graphml !== 'string' && !callback) { callback = graphml; }

    var opts = {
      url: '/bulkload/graphml',
      method: 'POST',
      form: { graphml: graphml },
    };
    return utils.apiCall(opts, callback);
  }

  //  Buld Upload - graphson
  function uploadGraphSON(graphson, callback) {

    if (typeof graphson !== 'string' && !callback) { callback = graphson; }

    var opts = {
      url: '/bulkload/graphson',
      method: 'POST',
      form: { graphson: graphson },
    };
    return utils.apiCall(opts, callback);
  }

  // Extract
  function extractBulk(format, callback) {

    if (!callback) { callback = format; }
    if (!format) { format = 'json'; }

    var opts = {
      url: '/extract',
      method: 'GET',
      headers: {
        'Content-Type': 'application/' + format,
      },
    };
    return utils.apiCall(opts, callback);
  }

  var io = {
    bulkload: {
      graphml: uploadGraphMl,
      graphson: uploadGraphSON,
    },
    extract: extractBulk,
  };

  // Return object
  return {
    schema: require('./schema')(utils),
    vertices: vertices,
    edges: edges,
    gremlin: gremlin,
    io: io,
  };
};
