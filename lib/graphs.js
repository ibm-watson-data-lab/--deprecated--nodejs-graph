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
  
  this.url = function url(graph) {
    return {
      baseURL: this.config.url.substr(0, this.config.url.lastIndexOf('/')),
      url: (graph)? '/_graphs/' + graph : '/_graphs'
    };
  };
  
  this.get = function(callback) {
    var opts = {
      url: this.url(),
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
  
  this.add = function(callback, name) {
    var opts = {
      url: this.url(name),
      method: 'POST',
      json: true,
    };
    this.apiCall(opts, callback);
  };
  
  this.delete = function(callback, graph) {
    var opts = {
      url: this.url(graph),
      method: 'DELETE',
      json: true,
    };
    this.apiCall(opts, callback);
  };

  return this;
};
