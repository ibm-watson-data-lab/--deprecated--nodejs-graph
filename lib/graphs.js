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

var url = require('url');

module.exports = function () {

  this.graphUrl = function url(graph) {
    return {
      baseURL: this.config.url.substr(0, this.config.url.lastIndexOf('/')),
      url: (graph) ? '/_graphs/' + graph : '/_graphs',
    };
  };

  this.get = function (callback) {
    var opts = {
      url: this.graphUrl(),
      method: 'GET',
      json: true,
    };
    this.apiCall(opts, function (error, body) {
      if (error) {
        callback(error, body);
      } else {
        callback(null, body.graphs);
      }
    });
  };

  this.create = function (name, callback) {
    if (typeof name === 'function') {
      callback = name;
      name = null;
    }

    var opts = {
      url: this.graphUrl(name),
      method: 'POST',
      json: true,
    };
    this.apiCall(opts, callback);
  };

  this.delete = function (graph, callback) {
    var opts = {
      url: this.graphUrl(graph),
      method: 'DELETE',
      json: true,
    };
    this.apiCall(opts, callback);
  };

  // Change which graph is in use
  this.set = function(name, callback) {
    var config = this.config;
    var urlParse = url.parse(name);
    if(urlParse.protocol) {
      name = urlParse.pathname.substr(urlParse.pathname.lastIndexOf('/') + 1);
    }
    this.get(function(error, result) {
      if(result.indexOf(name) < 0) {
        error = true;
        name = 'Graph ' + name + ' does not exist';
      }
      var baseUrl = config.url.substr(0, config.url.lastIndexOf('/'));
      config.url = baseUrl + '/' + name;
      callback(error, name);
    });
  };

  return this;
};
