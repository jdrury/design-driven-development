'use strict';

//Prorjects service used for articles REST endpoint
angular.module('mean.versions').factory('Versions', ['$resource', function($resource) {
	return $resource('projects/:projectId/versions/:versionId', {
		projectId: '@projectId',
		versionId: '@_id'
	});
}]);

angular.module('mean.versions').factory('NoteCount', ['$resource', function($resource) {
	return $resource('projects/:projectId/versions/:versionId/notes/:noteId', {
		projectId: '@projectId',
		versionId: '@versionId',
		noteId: '@_id'
	});
}]);