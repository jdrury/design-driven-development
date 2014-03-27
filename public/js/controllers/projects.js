'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Global', 'Projects', 'UsersToAdd', function ($scope, $stateParams, $location, Global, Projects, UsersToAdd) {
	$scope.global = Global;

  // concatenated links (used for back button)
  $scope.projectID = '#!/projects/' + $stateParams.projectId;

	// Get user info for dropdown list
	$scope.findUsers = function() {
		$scope.users = [];

		UsersToAdd.query(function(users) {
			users.forEach(function(user) {
				if (user._id !== window.user._id) {
          // if user is not the logged in user
					$scope.users.push(user);
				}
			});
		});


  };

$scope.selectCollaborator = function(user) {
      $scope.project.users.push(user);

      // if the user is not a collaborator, add them to array
      // if ($scope.users.indexOf(user) !== -1) {
      //   $scope.users.push(user);
      //   console.log(users)
      // } else {
      //   // remove users that already exist
      //   var i = $scope.users.indexOf(user);
      //   $scope.users.splice(i,1);
      // }
      // return users;
    }

  // $scope.selectCollaborator = function(user) {
  //   var collaborators = [];
  //   $scope.collaborators = collaborators;

  //   if ($scope.collaborators.indexOf(user) !== -1) {
  //     // if the user is not a collaborator, add them to array
  //     $scope.collaborators.push(user);
  //     console.log(collaborators)
  //   } else {
  //     // remove users that already exist in array
  //     var i = $scope.collaborators.indexOf(user);
  //     $scope.collaborators.splice(i,1);
  //   }
  //   return collaborators;
  // }

	$scope.create = function() {
		var project = new Projects({
			title: this.title
			, userToAdd: this.userToAdd
		});
		project.$save(function(response) {
			$location.path('/projects/' + response._id);
		});

		this.title = '';
		this.userToAdd = '';
	};

	$scope.remove = function(project) {
		var r = confirm("Are you sure you want to delete this project?\nThis action can't be undone");
		console.log(project);
		if(r == true){

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
		}
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