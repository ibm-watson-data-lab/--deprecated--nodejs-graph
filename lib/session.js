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

module.exports = function (callback) {
  var opts = {
    url: {
      baseURL: this.config.url.substr(0, (this.config.url.length - 2)),
      url: '/_session',
    },
    method: 'GET',
    json: true,
  };

  var config = this.config;

  this.apiCall(opts, function (error, response, body) {
    if (err) {
      callback(err, null);
    } else {
      callback(err, body['gds-token']);
    }
  });

  return this;
};
