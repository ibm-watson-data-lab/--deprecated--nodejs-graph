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
var _       = require('underscore');

// Handle URL Requests
function apiCall(opts, callback) {
  if (!opts) { opts = {}; }

  var config = this.config;

  // Debug
  opts.debug = (config.debug) ? config.debug :
    ((!opts.debug) ? false : opts.debug);

  // Force the URL
  opts.url = config.url + opts.url;

  // Auth
  opts.auth = {
    user: config.username,
    pass: config.password,
  };

  // Debug Opts
  if (opts.debug) { console.log(opts); }

  return request(opts, function(error, response, body) {
    var returnObject = {
      error: error,
      response: response,
      body: body,
    };

    if (opts.debug) { console.log(returnObject); }

    if (!callback) {
      return returnObject;
    }

    return callback(error, response, body);
  });
}

module.exports = exports = function init(config) {
  return {
    config: config,
    apiCall: apiCall,
  };
};
