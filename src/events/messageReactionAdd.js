const { ReactionManager, User, MessageReaction } = require("discord.js");
const ReactionRoleManager = require("../Reactionrole/ReactionRoleManager");

module.exports = {
	name: 'messageReactionAdd',
	once: false,
	
	/**
	 * 
	 * @param {MessageReaction} react 
	 * @param {User} user 
	 * @returns 
	 */
	async execute(react, user) {
		if(user.bot === true) return;

		let client = user.client;


		/**
		 * @type {ReactionRoleManager}
		 */
		let reactionRoleManager = client.reactionRoleManager;
		
		let reactionroles = reactionRoleManager.get(react.message.id, react.emoji);

		if(reactionroles !== undefined){
			let guildMember = await react.message.guild.members.fetch(user);
			for(let reactionrole of reactionroles){
				guildMember.roles.add(reactionrole.roleid).catch(() => {
					console.error;
					react.message.channel.send('Missing Permissions!');
				});	
			}
		}

	},
};