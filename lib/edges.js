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

  // Create Edge
  this.create = function (label, outV, inV, properties, callback) {

    if (typeof callback === 'undefined') {
      callback = properties;
    }

    var postBody = {
      label: label,
      outV: outV,
      inV: inV,
    };

    if (typeof properties === 'object') {
      for (var attr in properties) {
        if (typeof postBody[attr] === 'undefined') {
          postBody[attr] = properties[attr];
        }
      }
    }

    var opts = {
      url: '/edges',
      method: 'POST',
      json: true,
      body: postBody,
    };
    return this.apiCall(opts, callback);
  };

  // Update Edge
  this.update = function (id, keyPairs, callback, method) {
    var opts = {
      url: '/edges/' + id,
      method: (typeof method !== 'undefined') ? method : 'PUT',
      json: true,
      body: keyPairs,
    };

    return this.apiCall(opts, callback);
  };

  // Get Edge
  this.get = function (id, callback) {
    var opts = {
      url: '/edges/' + id,
      method: 'GET',
    };

    return this.apiCall(opts, callback);
  };

  // Delete Edge
  this.delete = function (id, callback) {
    var opts = {
      url: '/edges/' + id,
      method: 'DELETE',
    };

    return this.apiCall(opts, callback);
  };

  // Delete Edge Property
  this.delete = function (id, properties, callback) {
    var opts = {
      url: '/edges/' + id,
      method: 'DELETE',
      qs: properties,
    };

    return this.apiCall(opts, callback);
  };

  return this;
};
