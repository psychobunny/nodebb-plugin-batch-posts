'use strict';

const controllers = require('./lib/controllers');
const batch = require('./lib/batch');
const user = require.main.require('./src/user');
const meta = require.main.require('./src/meta');
const emailer = require.main.require('./src/emailer');
const winston = require.main.require('winston');
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

plugin.onEmailReceive = (data, callback) => {
	var res = data.res;
	var body = data.req.body;
	var subject = body.subject;
	var cid = subject.match(/BATCH: (\d+)/i);
	var envelope = JSON.parse(body.envelope);
	var email = envelope.from;
	var text = body.text.trim();

	if (cid && cid.length && cid[1] && email && text) {
		user.getUidByEmail(email, function (err, uid) {
			if (err) {
				return callback(err);
			}

			batch.parseBatchAndPost(uid, cid[1], text, function (err, data) {
				if (err || data.faultyPosts) {
					return handleEmailError((err || '') + data.faultyPosts.replace(/\n/g, '<br />'), email, subject);
				}

				res.sendStatus(200);
			});
		});
	} else {
		callback(null, data);
	}
};

function handleEmailError(err, email, subject) {
	winston.error('[plugins] Batch Post: Unable to post', err);

	emailer.sendToEmail('batch/bounce', email, meta.config.defaultLang || 'en-GB', {
		site_title: meta.config.title || 'NodeBB',
		subject: 'Re: ' + subject,
		messageBody: err,
	}, function (err) {
		if (err) {
			winston.error('[emailer.sendgrid] Unable to bounce email back to sender! ' + err.message);
		} else {
			winston.verbose('[emailer.sendgrid] Bounced email back to sender (' + email + ')');
		}
	});
}

module.exports = plugin;
