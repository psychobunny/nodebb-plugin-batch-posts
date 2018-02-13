'use strict';

const util = require('util');
const groups = require.main.require('./src/groups');
const topics = require.main.require('./src/topics');
const categories = require.main.require('./src/categories');
const posts = require.main.require('./src/posts');
const user = require.main.require('./src/user');
const db = require.main.require('./src/database');

module.exports = {
	isMemberOfGroup: util.promisify(groups.isMember),
	getGroups: util.promisify(groups.getGroups),
	getTopicData: util.promisify(topics.getTopicData),
	getTopicsByTids: util.promisify(topics.getTopicsByTids),
	postTopic: util.promisify(topics.post),
	getPostsByPids: util.promisify(posts.getPostsByPids),
	createPost: util.promisify(posts.create),
	getUserFields: util.promisify(user.getUserFields),
	getUserSettings: util.promisify(user.getSettings),
	buildForSelectCategories: util.promisify(categories.buildForSelect),

	getObject: util.promisify(db.getObject),
	setObject: util.promisify(db.setObject),
	setObjectField: util.promisify(db.setObjectField),
	incrObjectField: util.promisify(db.incrObjectField),
	deleteObjectField: util.promisify(db.deleteObjectField),
	getObjectField: util.promisify(db.getObjectField),
	sortedSetAdd: util.promisify(db.sortedSetAdd),
	sortedSetRemove: util.promisify(db.sortedSetRemove),
	getSortedSetRevRange: util.promisify(db.getSortedSetRevRange),
};
