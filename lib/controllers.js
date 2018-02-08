'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/nodebb-plugin-batch-posts/admin', {});
};

module.exports = Controllers;
