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

  this.graphml = function (graphml, callback) {

    if (typeof graphml !== 'string' && typeof callback === 'undefined') {
      callback = graphml;
    }

    var opts = {
      url: '/bulkload/graphml',
      method: 'POST',
      form: { graphml: graphml },
    };
    return this.apiCall(opts, callback);
  };

  this.graphson = function (graphson, callback) {

    if (typeof graphson !== 'string' && typeof callback === 'undefined') {
      callback = graphson;
    }

    var opts = {
      url: '/bulkload/graphson',
      method: 'POST',
      form: { graphson: graphson },
    };
    return this.apiCall(opts, callback);
  };

  return this;
};
