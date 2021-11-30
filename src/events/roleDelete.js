const { Role } = require("discord.js");

module.exports = {
	name: 'roleDelete',
	once: false,

	/**
	 * @param {Role} role 
	 */
	async execute(role) {
		console.log('roleDelete');
		role.client.reloadPermission(role.client, role.guild);
	},
};