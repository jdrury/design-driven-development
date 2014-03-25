'use strict';

// Projects routes use articles controller
var projects = require('../controllers/projects');
var authorization = require('./middlewares/authorization');

// Project authorization helpers
// var hasAuthorization = function(req, res, next) {
// 	if (req.project.users[0].user.id !== req.user.id) {
// 		return res.send(401, 'User is not authorized');
// 	}
// 	next();
// };

module.exports = function(app) {

	app.get('/projects', projects.all);
	app.post('/projects', authorization.requiresLogin, projects.create);
	app.get('/projects/:projectId', projects.show);
	app.put('/projects/:projectId', authorization.requiresLogin, projects.update);
	app.del('/projects/:projectId', authorization.requiresLogin, projects.destroy);
	app.post('/projects/invite', authorization.requiresLogin, projects.invite);

	// Finish with setting up the projectId param
	app.param('projectId', projects.project);

};