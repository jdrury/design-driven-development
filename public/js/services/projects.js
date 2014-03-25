'use strict';

//Projects service used for articles REST endpoint
angular.module('mean.projects').factory('Projects', ['$resource', function($resource) {

	return $resource('projects/:projectId', {
		projectId: '@_id'
	}, {
		update: {
			method: 'PUT'
		}
	});

}]);

angular.module('mean.projects').factory('UsersToAdd', ['$resource', function($resource) {
	return $resource('users/:userId', {
		userId: '@_id'
	});
}]);