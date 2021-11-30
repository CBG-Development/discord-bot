const { Client, Guild, Permissions } = require("discord.js");

module.exports = {
    /**
    * 
    * @param {Client} client 
	* @param {Guild} guild
    */
    async reloadPermission (client, guild){
        console.log(`[Started] reloading Permissions of ${guild.name}: ${guild.id}`);
		

		//get the guild

		//get the command list
		const commandlist = await guild.commands.fetch();

		/**
		 * @type {Collection}
		 */
		const commands = client.commands;

		//permisiton for the @everyon role
		const peveryone =  {
			id: guild.roles.everyone.id,
			type: 'ROLE',
			permission: true,
		};

		//permission for everye role with admin permison
		let padmin = [];

		//fill the list
		let roles = await guild.roles.fetch();
		roles.forEach(role => {
			if(role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
				padmin.push({
					id: role.id,
					type: 'ROLE',
					permission: true,
				});
			}
		})

		//creat owner permision
		const powner = {
			id: guild.ownerId,
			type: 'USER',
			permission: true
		}


		//set the permison for eche Command
		commandlist.forEach(slashCommand => {

			console.log(`Canging command ${slashCommand.name}: ${slashCommand.id} on ${slashCommand.guild.name}: ${slashCommand.guild.id}`);

			const data = commands.get(slashCommand.name);

			let pCommand = [];

			//if there are Specific roles add them 
			if(data.permissions !== undefined){

				for(let roleId of data.permissions){
					pCommand.push({
						id: roleId,
						type: 'ROLE',
						permission: true,
					});
				}
			}
			


			if(data.needAdminPermission === true){
				guild.commands.permissions.set({
					command: slashCommand.id,
					permissions: [...padmin, powner, ...pCommand]
				});
			}else{
				guild.commands.permissions.set({
					command: slashCommand.id,
					permissions: [peveryone]
				});
			}

			
			
		})

		console.log(`[Finished] reloading Permissions of ${guild.name}: ${guild.id}`);
    }
}
