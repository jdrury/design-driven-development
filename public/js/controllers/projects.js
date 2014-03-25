'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Global', 'Projects', 'UsersToAdd', function ($scope, $stateParams, $location, Global, Projects, UsersToAdd) {
	$scope.global = Global;

	// Get user info for dropdown list
	$scope.findUsers = function() {
		$scope.users = [];
		UsersToAdd.query(function(users) {
			users.forEach(function(user) {
				if (user._id !== window.user._id) {
					$scope.users.push(user);
				}
			});
		});
	};

	$scope.create = function() {
		var project = new Projects({
			title: this.title,
			userToAdd: this.userToAdd
		});
		project.$save(function(response) {
			$location.path('/projects/' + response._id);
		});

		this.title = '';
		this.userToAdd = '';
	};

	$scope.remove = function(project) {
		console.log(project);
		if (project) {
			project.$remove();

			for (var i in $scope.projects) {
				if ($scope.projects[i] === project) {
					$scope.projects.splice(i, 1);
				}
			}
		}
		else {
			$scope.project.$remove();
			$location.path('/');
		}
		$location.path('/');
	};

	$scope.update = function() {
		var project = $scope.project;
		if (!project.updated) {
			project.updated = [];
		}
		project.updated.push(new Date().getTime());

		project.$update(function() {
			$location.path('/projects/' + project._id);
		});
	};

	$scope.find = function() {
		Projects.query(function(projects) {
			$scope.projects = [];
			projects.forEach(function(project) {
				project.users.forEach(function(user) {
					if (user._id === window.user._id) {
						$scope.projects.push(project);
					}
				});
			});
		});
	};

	$scope.findOne = function() {
		Projects.get({
			projectId: $stateParams.projectId
		}, function(project) {
			$scope.project = project;
		});
	};
}]);