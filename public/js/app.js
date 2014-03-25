'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'ngUpload', 'mean.system', 'mean.projects', 'mean.versions', 'mean.notes']);

angular.module('mean.system', []);
angular.module('mean.projects', []);
angular.module('mean.versions', []);
angular.module('mean.notes', []);