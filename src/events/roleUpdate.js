const { Role } = require("discord.js");

module.exports = {
	name: 'roleUpdate',
	once: false,
	/**
	 * 
	 * @param {Role} oldrole 
	 * @param {Role} newrole 
	 */
	async execute(oldrole, newrole) {
		console.log('roleUpdate');
		oldrole.client.reloadPermission(oldrole.client, oldrole.guild);
	},
};