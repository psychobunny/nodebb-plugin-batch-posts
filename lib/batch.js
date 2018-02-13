'use strict';

const async = require.main.require('async');
const batch = module.exports;
const nbb = require('./nodebb');
const topics = require.main.require('./src/topics');

const done = (fail, success) => new Promise((resolve, reject) => {
	if (fail) { reject(fail); } else { resolve(success); }
});

batch.parseBatchAndPost = (uid, cid, batch, cb) => {
	parseBatch(uid, cid, batch, cb);
};

const regexes = {
	delimiter: /#{5,}[\s\S]*?#{5,}/g,
	property: /# (\S*): (.*)/,
	arrayify: /\s?,\s?/g,
};

function parseBatch(uid, cid, batch, cb) {
	const headers = batch.match(regexes.delimiter).filter(function (n) { return !!n; });
	const batches = batch.split(regexes.delimiter).filter(function (n) { return !!n; });
	const posts = [];

	headers.forEach((header, i) => {
		const regex = RegExp(regexes.property, 'g');
		const post = {};
		let val = regex.exec(header);

		while (val !== null) {
			if (val && val[2]) {
				post[val[1]] = val[2];
			}

			val = regex.exec(header);
		}

		post.content = batches[i].trim();
		post.tags = post.tags ? post.tags.split(regexes.arrayify) : [];
		post.cid = post.cid ? post.cid : cid;
		post.uid = post.uid ? post.uid : uid;

		if (post.title && post.content && post.cid) {
			posts.push(post);
		}
	});

	async.eachLimit(posts, 50, function (post, next) {
		topics.post(post, next);
	}, cb);
}
