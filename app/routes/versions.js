'use strict';

// Versions routes use articles controller
var versions = require('../controllers/versions');
var projects = require('../controllers/projects');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

	app.get('/projects/:projectId/versions', versions.all);
	app.post('/projects/:projectId/versions', authorization.requiresLogin, versions.create);
	app.get('/projects/:projectId/versions/:versionId', versions.show);
	app.del('/projects/versions/:versionId', authorization.requiresLogin, versions.destroy);

	// Finish with setting up the versionId param
	app.param('versionId', versions.version);
	app.param('projectId', projects.project);

};