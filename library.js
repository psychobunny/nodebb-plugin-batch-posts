'use strict';

const controllers = require('./lib/controllers');
const nbb = require('./lib/nodebb');
const batch = require('./lib/batch');
const plugin = {};

plugin.init = (params, callback) => {
	const router = params.router;
	const hostMiddleware = params.middleware;

	router.get('/admin/plugins/batch-posts', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/batch-posts', controllers.renderAdminPage);

	require('./lib/socket.io/admin');

	callback();
};

plugin.addAdminNavigation = (header, callback) => {
	header.plugins.push({
		route: '/plugins/batch-posts',
		icon: 'fa-cloud-upload',
		name: 'Batch Posts',
	});

	callback(null, header);
};

plugin.onEmail = async (data, callback) => {
	const { batch, secret } = data;
	const nbbSecret = await nbb.getObjectField('settings:batch-posts', 'nodebbSecret');

	if (secret !== nbbSecret) {
		return done(new Error('[[error:not-allowed]]'));
	}

	batch.parseBatchAndPost(batch);
};

module.exports = plugin;
