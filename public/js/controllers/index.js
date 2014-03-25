'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Users', function ($scope, Global, Users) {
	$scope.global = Global;
	$scope.user = window.user;

	$scope.findProjects = function() {
		Users.get({ userId: window.user._id },function(users) {
			$scope.users = users;
		});
	};

}]);