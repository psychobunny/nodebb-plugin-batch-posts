'use strict';

var controllers = require('./lib/controllers');
var plugin = {};

plugin.init = function (params, callback) {
	var router = params.router;
	var hostMiddleware = params.middleware;

	router.get('/admin/plugins/batch-posts', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/batch-posts', controllers.renderAdminPage);

	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/batch-posts',
		icon: 'fa-cloud-upload',
		name: 'Batch Posts',
	});

	callback(null, header);
};

module.exports = plugin;
