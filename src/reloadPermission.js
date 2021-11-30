const { Client, Guild, Permissions } = require("discord.js");

module.exports = {
    /**
    * 
    * @param {Client} client 
	* @param {Guild} guild
    */
    async reloadPermission (client, guild){
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
						await guildCommand.permissions.set({ permissions: clientCommand.permissions });
					}
				}
			}
		}

		console.log(`[Finished] reloading Permissions of ${guild.name}: ${guild.id}`);
    }
}
