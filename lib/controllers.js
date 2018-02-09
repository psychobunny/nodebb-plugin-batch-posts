'use strict';

var Controllers = {};
var nbb = require('./nodebb');

Controllers.renderAdminPage = async function (req, res) {
	const categories = await nbb.buildForSelectCategories(req.uid, 'read');
	res.render('admin/plugins/batch-posts', {
		allCategories: categories,
	});
};

module.exports = Controllers;

