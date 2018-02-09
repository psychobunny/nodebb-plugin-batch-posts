'use strict';

const socketAdmin = require.main.require('./src/socket.io/admin');
const batch = require('../batch');

socketAdmin.plugins.batchPosts = {};

socketAdmin.plugins.batchPosts.post = (socket, data, cb) => {
	batch.parseBatchAndPost(socket.uid, data.category.cid, data.batch, cb);
};
