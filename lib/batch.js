'use strict';

const async = require.main.require('async');
const batch = module.exports;
const db = require.main.require('./src/database');
const topics = require.main.require('./src/topics');


batch.parseBatchAndPost = (uid, cid, batch, cb) => {
	parseBatch(uid, cid, batch, cb);
};

batch.getProgress = (cb) => {
	db.getObject('plugins:nodebb-plugin-batch-posts', cb);
};

batch.stopPosting = (cb) => {
	db.setObjectField('plugins:nodebb-plugin-batch-posts', 'working', 0, cb);
};

const regexes = {
	delimiter: /#{10,}[\s\S]*?#{10,}/g,
	property: /# (\S*): (.*)/,
	arrayify: /\s?,\s?/g,
};

function parseBatch(uid, cid, batch, cb) {
	const headers = batch.match(regexes.delimiter).filter(function (n) { return !!n; });
	const batches = batch.split(regexes.delimiter).filter(function (n) { return !!n; });
	const posts = [];
	const faultyPosts = [];

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
		post.batchIndex = i;

		if (post.title && post.content && post.cid) {
			posts.push(post);
		} else {
			faultyPosts.push(headers[i] + '\n\n ERROR: Missing title, content or category info.');
		}
	});

	db.setObject('plugins:nodebb-plugin-batch-posts', {
		working: 1,
		progress: 0,
		length: posts.length,
	}, function () {
		async.eachLimit(posts, 10, (toPost, next) => {
			db.getObjectField('plugins:nodebb-plugin-batch-posts', 'working', function (err, working) {
				if (err || !parseInt(working, 10)) {
					return next(err);
				}

				topics.post(toPost, function (err) {
					if (err) {
						var i = toPost.batchIndex;
						faultyPosts.push(headers[i] + '\n\n' + err);
					}

					db.incrObjectField('plugins:nodebb-plugin-batch-posts', 'progress', function () {
						return next();
					});
				});
			});
		}, function (err) {
			db.setObjectField('plugins:nodebb-plugin-batch-posts', 'working', 0);
			if (err) {
				return cb(err);
			}
			cb(null, {
				faultyPosts: faultyPosts.join('\n\n'),
			});
		});
	});
}
