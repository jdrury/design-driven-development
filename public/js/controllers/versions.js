'use strict';

angular.module('mean.versions').controller('VersionsController', ['$scope', '$stateParams', '$location', '$timeout', 'Global', 'Versions', 'NoteCount', function ($scope, $stateParams, $location, $timeout, Global, Versions, NoteCount) {
	$scope.global = Global;

	// concatenated links
	$scope.formCreate = '/projects/' + $stateParams.projectId + '/versions';
	$scope.projectCreate = '#!/projects/' + $stateParams.projectId + '/versions/create';
	$scope.projectView = '#!/projects/' + $stateParams.projectId + '/versions/';

  // waits for Express 'create' function to respond with 'content' before redirecting user to new version
	$scope.create = function(content) {

		// $timeout(function() {
			// $location.path('/projects/' + $stateParams.projectId);
      $location.path('/projects/' + $stateParams.projectId + '/versions/' + content._id);
		// }, 3000);
	};

	$scope.remove = function(version) {
		console.log($scope.version);
		if (version) {
			version.$remove();
			for (var i in $scope.versions) {
				if ($scope.versions[i] === version) {
					$scope.versions.splice(i, 1);
				}
			}
		}
		else {
			$scope.version.$remove();
			$location.path('/projects/' + $stateParams.projectId);
		}
		$location.path('/projects/' + $stateParams.projectId);
	};

	$scope.find = function() {

		Versions.query({ projectId: $stateParams.projectId }, function(versions) {
			$scope.versions = [];
			versions.forEach(function(version) {
				if (version.project._id === $stateParams.projectId) {
					$scope.versions.unshift(version);
				}
			});

			$scope.versions.forEach(function(version) {
				NoteCount.query({ projectId: $stateParams.projectId, versionId: version._id }, function(notes) {
					$scope.notes = [];
					notes.forEach(function(note) {
						if (note.version._id === version._id) {
							$scope.notes.push(note);
						}
					});
					version.noteCount = $scope.notes.length;
				});
			});
		});
	};

	$scope.findOne = function() {
		Versions.get({
			projectId: $stateParams.projectId,
			versionId: $stateParams.versionId
		}, function(version) {
			$scope.version = version;
		});
	};
}]);