const fs = require('fs');
const reactionrole = require('../commands/reactionrole');
const ReactionRoleManager = require('../Reactionrole/ReactionroleManager');

module.exports = {
	name: 'messageDelete',
	once: false,
	async execute(message) {

		let client = message.client;

		/**
		 * @type {ReactionRoleManager}
		 */
		let reactionRoleManager = client.reactionRoleManager;

		reactionRoleManager.deleteMessageId(message.id);

	},
};