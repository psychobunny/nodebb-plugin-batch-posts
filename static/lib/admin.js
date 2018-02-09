'use strict';

/* globals $, app, socket, define, ajaxify */

define('admin/plugins/batch-posts', ['settings', 'categorySelector'], function (settings, categorySelector) {
	var ACP = {};

	ACP.init = function () {
		settings.load('batch-posts', $('.batch-posts-settings'));

		$('#save').on('click', function () {
			settings.save('batch-posts', $('.batch-posts-settings'), function () {
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

		categorySelector.init($('[component="category-selector"]'));
		var categories = ajaxify.data.allCategories;
		if (categories.length) {
			categorySelector.selectCategory(categories[0].cid);
		}

		$('#batchPost').on('click', function () {
			socket.emit('admin.plugins.batchPosts.post', { batch: $('#batchData').val(), category: categorySelector.getSelectedCategory() }, function (err) {
				if (err) {
					return app.alertError(err);
				}

				app.alertSuccess('Successfully posted topics.');
				ajaxify.refresh();
			});
		});
	};

	return ACP;
});
