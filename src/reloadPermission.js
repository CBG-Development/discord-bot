const { Client, Guild } = require("discord.js");

module.exports = {
    /**
    * 
    * @param {Client} client 
	* @param {Guild} guild
    */
    async reloadPermission (client, guild, token) {
		try {
			
			console.log(`[Started] reloading Permissions of ${guild.name}: ${guild.id}`);

			const ClientCommands = client.commands;
			const GuildCommands = await guild.commands.fetch();
			
			// Search guild commands
			for ([key, guildCommand] of GuildCommands) {
				// Search client commands
				for ([key, clientCommand] of ClientCommands) {
					if (guildCommand.name === key) {
						if (clientCommand.permissions) {
							for (let i = 0; i < clientCommand.permissions.length; i++) {
								clientCommand.permissions[i].permission = true;
							}
							await guildCommand.permissions.set(
								{ 
									guild: guild.id,
									command: guildCommand.id,
									token: token,
									permissions: clientCommand.permissions 
								}
							);
						}
					}
				}
			}

			console.log(`[Finished] reloading Permissions of ${guild.name}: ${guild.id}`);

		} catch (error) {

			console.log(`[ERROR] got an error on reloading Permissions of ${guild.name}: ${guild.id}`);
			console.error(error);
		}
    }
}
