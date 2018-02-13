'use strict';

/* globals $, window, app, socket, define, ajaxify */

define('admin/plugins/batch-posts', ['settings', 'categorySelector'], function (settings, categorySelector) {
	var ACP = {};
	var timeout;

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

		$('#stopPosting').on('click', function (ev) {
			socket.emit('admin.plugins.batchPosts.stopPosting', {}, function (err) {
				if (err) {
					return app.alertError(err);
				}

				app.alertSuccess('Stopped batch posting');
			});

			ev.preventDefault();
			return false;
		});

		$('#batchPost').on('click', function (ev) {
			$('.progress-bar').addClass('reset');
			$('.progress-bar').css('width', '0%');
			setTimeout(function () {
				$('.progress-bar').removeClass('reset');
			}, 1);
			$('.faultyPosts').addClass('hide');

			socket.emit('admin.plugins.batchPosts.post', { batch: $('#batchData').val(), category: categorySelector.getSelectedCategory() }, function (err, data) {
				if (err) {
					return app.alertError(err);
				}

				if (data.faultyPosts) {
					$('.faultyPosts').removeClass('hide');
					$('#faultyPosts').val(data.faultyPosts);
				} else {
					app.alertSuccess('Successfully posted all topics.');
				}
			});

			ev.preventDefault();
			return false;
		});

		timeout = setInterval(checkProgress, 1000);
	};

	function checkProgress() {
		socket.emit('admin.plugins.batchPosts.getProgress', function (err, data) {
			if (err) {
				window.clearTimeout(timeout);
				return app.alertError(err);
			}

			var bar = $('.progress-bar');
			var postBtn = $('#batchPost');

			if (!parseInt(data.working, 10)) {
				postBtn.removeAttr('disabled').text('Create Topics');
				bar.css('width', '100%');
			} else {
				postBtn.attr('disabled', true).text('Posting in progress...');

				var percent = parseInt(data.progress / data.length * 100, 10);
				console.log(data.progress, data.length, percent + '%');
				bar.css('width', percent + '%');
			}
		});
	}

	return ACP;
});
