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

  /*
    GET specific index
   */
  this.get = function (indexname, callback) {

    if (typeof callback === 'undefined') {
      callback = indexname;
    }

    var opts = {
      url: '/index' + ((typeof indexname === 'string') ? '/' + indexname : ''),
      method: 'GET',
      json: true,
    };

    return this.apiCall(opts, callback);

  };

  /*
    GET index status
   */
  this.getStatus = function (indexname, callback) {

    var opts = {
      url: '/index/' + indexname + '/status',
      method: 'GET',
      json: true,
    };

    return this.apiCall(opts, callback);

  };

  /*
    POST new index
   */
  this.create = function (index, callback) {

    var opts = {
      url: '/index',
      method: 'POST',
      json: true,
      body: index,
    };

    return this.apiCall(opts, callback);

  };

  /*
    DELETE specific index
   */
  this.delete = function (indexname, callback) {

    var opts = {
      url: '/index/' + indexname,
      method: 'DELETE',
    };

    return this.apiCall(opts, callback);

  };

  return this;
};
