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

  // vertices
  var vertices;

  return {
    vertices: vertices
  }
}
