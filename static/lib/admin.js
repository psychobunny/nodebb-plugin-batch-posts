'use strict';

/* globals $, app, socket, define */

define('admin/plugins/batch-posts', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('batch-posts', $('.batch-posts-settings'));

		$('#save').on('click', function () {
			Settings.save('batch-posts', $('.batch-posts-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'batch-posts-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};

	return ACP;
});
