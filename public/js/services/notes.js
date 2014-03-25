'use strict';

//Prorjects service used for notes REST endpoint
angular.module('mean.notes').factory('Notes', ['$resource', function($resource) {
	return $resource('projects/:projectId/versions/:versionId/notes/:noteId', {
		projectId: '@projectId',
		versionId: '@versionId',
		noteId: '@_id'
	}, {
		update: {
			method: 'PUT'
		}
	});
}]);