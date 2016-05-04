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

module.exports = function () {

  // Create Vertex
  this.create = function (keyPairs, callback) {

    // If label is included, process as Gremlin query
    if (typeof keyPairs.label === 'string') {
      var query = 'def g = graph.traversal(); g.addV(label, \'' +
        keyPairs.label + '\'';

      for (var key in keyPairs) {
        if (key !== 'label') {
          query += ', \'' + key + '\', \'' + keyPairs[key] + '\'';
        }
      }

      query += ')';
      this.gremlin(query, callback);
    } else {

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

      return this.apiCall(opts, callback);
    }
  };

  // Update Vertex
  this.update = function (id, keyPairs, callback, method) {
    var opts = {
      url: '/vertices/' + id,
      method: (typeof method !== 'undefined') ? method : 'PUT',
      json: true,
      body: keyPairs,
    };

    return this.apiCall(opts, callback);
  };

  // Vertex by ID or by property
  this.get  = function (lookup, callback) {
    var opts = {
      method: 'GET',
    };
    if (typeof lookup === 'string' ||
      typeof lookup === 'number') {
      opts.url = '/vertices/' + lookup;
    } else if (typeof lookup === 'object') {
      opts.url = '/vertices';
      opts.qs = lookup;
    } else {
      throw 'Cannot do a lookup against unknown lookup';
    }

    return this.apiCall(opts, callback);
  };

  // Vertex OUT
  this.out = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/out',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex IN
  this.in = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/in',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex BOTH
  this.both = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/both',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex OUT COUNT
  this.outCount = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/outCount',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex IN COUNT
  this.inCount = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/inCount',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex BOTH COUNT
  this.bothCount = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/bothCount',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex OUT ID's
  this.outIds = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/outIds',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex IN ID's
  this.inIds = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/inIds',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Vertex BOTH ID's
  this.bothIds = function (id, callback) {
    var opts = {
      url: '/vertices/' + id + '/bothIds',
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Delete Vertex
  this.delete = function (id, callback) {
    var opts = {
      url: '/vertices/' + id,
      method: 'DELETE',
    };

    return this.apiCall(opts, callback);
  };

  // Delete Vertex Property
  this.deleteProperty = function (id, properties, callback) {
    var opts = {
      url: '/vertices/' + id,
      method: 'DELETE',
      qs: properties,
    };

    return this.apiCall(opts, callback);
  };

  return this;
};
