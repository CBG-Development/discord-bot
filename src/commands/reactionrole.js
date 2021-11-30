const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const Reactionrole = require("../Reactionrole/ReactionRole");
const ReactionRoleManager = require('../Reactionrole/ReactionroleManager');

 /**
 * Title: Reaction role
 * Command: reactionrole
 * Description: Creacts a Reactionrole
 */
module.exports = {
	data: new SlashCommandBuilder()
	.setName("reactionrole")
	.setDescription('Creates a Reaciton role')
	.setDefaultPermission(false)
    .addStringOption(option => option
		.setName('message')
		.setDescription('the Mesageid')
		.setRequired(true))
    .addRoleOption(option => option
		.setName('role')
		.setDescription('test')
		.setRequired(true)),
	
	needAdminPermission: true,
	/**
     * Execute
     * @param {Interaction} interaction 
     */
	async execute(interaction) {
		
		let messageid = interaction.options.getString('message');
		let client = interaction.client;
		
		 /**
		  * @type {ReactionRoleManager}
		  */
		let reactionRoleManager = client.reactionRoleManager;


		//search for the MSG of the user
		await interaction.channel.messages.fetch(messageid)
		.then(msg => {

			//filter that is only for the user
			const filter = (reaction, user) => {
				return user.id === interaction.user.id;
			};
			
			//check if react emoji is 
			let reactetedrecord = false;
			if(msg.reactions.cache.get('⏺️') === undefined){
				reactetedrecord = true;

				//react
				msg.react('⏺️');
			}

			//reply
			interaction.reply({content: 'React to the Message with a Emoji', ephemeral: true});

		
			//wait for Reaction 
			msg.awaitReactions({filter, max: 1, time: 60000, errors: ['time']})
			.then(async collected => {

				let emoji = collected.first().emoji;

				//react
				await msg.react(emoji);

				//remove my emote
				if(emoji.name !== '⏺️' && reactetedrecord){
					await msg.reactions.resolve("⏺️").users.remove(client.user);	
				}
				
				let reactionrole;

				//adding role to the map
				if(emoji.id === null){
					reactionrole = new Reactionrole(messageid, emoji.name, interaction.options.getRole('role').id);
				} else {
					reactionrole = new Reactionrole(messageid, emoji.id, interaction.options.getRole('role').id);
				}

				reactionRoleManager.push(reactionrole);

				interaction.followUp({content: 'Reaction rolle added', ephemeral: true});

				console.log("Added Reaction role: [message id: " + msg.id + ", message text: " + msg.content + ", emote: " + emoji.name + ", role: " + interaction.options.getRole('role').name) + ']';

			})
			.catch(async collected => {
				await msg.reactions.resolve("⏺️").users.remove(client.user);
				await interaction.followUp({content: 'time out', ephemeral: true});
				console.error;
			})
			
		})
		.catch(msg => {

			interaction.reply({content: 'incorect Mesage id', ephemeral: true});
			console.error;

			
		});
	

	},
};
