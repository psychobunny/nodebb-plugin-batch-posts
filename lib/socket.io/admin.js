'use strict';

const socketAdmin = require.main.require('./src/socket.io/admin');
const batch = require('../batch');

socketAdmin.plugins.batchPosts = {};

socketAdmin.plugins.batchPosts.post = (socket, data, cb) => {
	batch.parseBatchAndPost(socket.uid, data.category.cid, data.batch, cb);
};

socketAdmin.plugins.batchPosts.getProgress = (socket, data, cb) => {
	batch.getProgress(cb);
};

socketAdmin.plugins.batchPosts.stopPosting = (socket, data, cb) => {
	batch.stopPosting(cb);
};
