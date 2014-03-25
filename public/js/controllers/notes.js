'use strict';

angular.module('mean.notes').controller('NotesController', ['$scope', '$stateParams', '$location', 'Global', 'Notes', function ($scope, $stateParams, $location, Global, Notes) {
	$scope.global = Global;

	$scope.notifyForm = '/projects/' + $stateParams.projectId + '/versions/' + $stateParams.versionId + '/notes/notify';

	$scope.baseUrl = '/#!/projects/' +$stateParams.projectId + '/versions/' + $stateParams.versionId + '/notes/';

	$scope.findCoordinates = function(event) {
		console.log(event);
		$scope.coordinates = {
			'x': event.offsetX || event.layerX,
			'y': event.offsetY || event.layerY
		};
	};

	$scope.content = {
		note: ''
	};

	$scope.show = {
		note: false,
		edit: false
	};

	$scope.create = function() {
		var note = new Notes({
			projectId: $stateParams.projectId,
			versionId: $stateParams.versionId,
			content: this.content.note,
			xcoord: this.coordinates.x,
			ycoord: this.coordinates.y
		});
		note.$save(function(response) {
			$scope.find();
			$location.path('/projects/' + $stateParams.projectId + '/versions/' + $stateParams.versionId);
		});

		this.content.note = '';
	};

	$scope.notify = function() {
		console.log('is this getting called?');
		$location.path('/projects/' + $stateParams.projectId + '/versions/' + $stateParams.versionId);
	};

	$scope.remove = function(note) {
		if (note) {
			note.$remove();
			for (var i in $scope.notes) {
				if ($scope.notes[i] === note) {
					$scope.notes.splice(i, 1);
				}
			}
		}
		else {
			$scope.note.$remove();
			$location.path('/projects/' + $stateParams.projectId + '/versions/' + $stateParams.versionId);
		}
	};

	$scope.update = function() {
		var note = $scope.noteToEdit;
		if (!note.updated) {
			note.updated = [];
		}
		note.updated.push(new Date().getTime());

		note.$update(function() {
			$scope.find();
			$location.path('/projects/' + $stateParams.projectId + '/versions/' + $stateParams.versionId);
		});
	};

	$scope.find = function() {
		Notes.query({ projectId: $stateParams.projectId, versionId: $stateParams.versionId }, function(notes) {
			$scope.notes = [];
			notes.forEach(function(note) {
				if (note.version._id === $stateParams.versionId) {
					$scope.notes.push(note);
				}
			});
			$scope.notes.forEach(function(note) {
				note.zindex = 1000;
			});
		});
	};

	$scope.findOne = function() {
		Notes.get({
			projectId: $stateParams.projectId,
			versionId: $stateParams.versionId,
			noteId: $stateParams.noteId
		}, function(note) {
			$scope.note = note;
			console.log(note);
		});
	};

	$scope.findToEdit = function(id) {
		Notes.get({
			projectId: $stateParams.projectId,
			versionId: $stateParams.versionId,
			noteId: id
		}, function(note) {
			$scope.noteToEdit = note;
		});
	};

}]);