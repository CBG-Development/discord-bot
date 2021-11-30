const { Role } = require("discord.js");

module.exports = {
	name: 'roleCreate',
	once: false,

	/**
	 * 
	 * @param {Role} role 
	 */
	async execute(role) {
		console.log('roleCreate');
		role.client.reloadPermission(role.client, role.guild);
	},
};