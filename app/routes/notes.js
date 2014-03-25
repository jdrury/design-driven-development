'use strict';

// Notes routes use articles controller
var notes = require('../controllers/notes');
var versions = require('../controllers/versions');
var projects = require('../controllers/projects');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

	app.get('/projects/:projectId/versions/:versionId/notes', notes.all);
	app.post('/projects/:projectId/versions/:versionId/notes', authorization.requiresLogin, notes.create);
	app.get('/projects/:projectId/versions/:versionId/notes/:noteId', notes.show);
		// these two work but I think there's a problem with the load method that I can't get the versionId and projectId
	app.put('/projects/versions/notes/:noteId', authorization.requiresLogin, notes.update);
	app.del('/projects/versions/notes/:noteId', authorization.requiresLogin, notes.destroy);
	app.post('/projects/:projectId/versions/:versionId/notes/notify', authorization.requiresLogin, notes.notify);

	// Finish with setting up the noteId param
	app.param('noteId', notes.note);
	app.param('versionId', versions.version);
	app.param('projectId', projects.project);

};