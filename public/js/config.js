'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('allProjects', {
        url: '/projects',
        templateUrl: 'views/projects/list.html'
    })
      .state('createProject', {
        url: '/projects/create',
        templateUrl: 'views/projects/create.html'
    })
      .state('editProject', {
        url: '/projects/:projectId/edit',
        templateUrl: 'views/projects/edit.html'
    })
      .state('projectById', {
        url: '/projects/:projectId',
        templateUrl: 'views/projects/view.html'
    })
      .state('allVersions', {
        url: '/projects/:projectId/versions',
        templateUrl: 'views/versions/list.html'
    })
      .state('createVersion', {
        url: '/projects/:projectId/versions/create',
        templateUrl: 'views/versions/create.html'
    })
      .state('versionById', {
        url: '/projects/:projectId/versions/:versionId',
        templateUrl: 'views/versions/view.html'
    })
      .state('allNotes', {
        url: '/projects/:projectId/versions/:versionId/notes',
        templateUrl: 'views/notes/list.html',
    })
      .state('createNotes', {
        url: '/projects/:projectId/versions/:versionId/notes/create',
        templateUrl: 'views/notes/create.html'
    })
      .state('editNote', {
        url: '/projects/:projectId/versions/:versionId/notes/:noteId/edit',
        templateUrl: 'views/notes/edit.html'
    })
      .state('noteById', {
        url: '/projects/:projectId/versions/:versionId/notes/:noteId',
        templateUrl: 'views/notes/view.html'
    })
      .state('home', {
        url: '/',
        templateUrl: 'views/index.html'
    });
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);
