const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');

/**
 * Title: Ping!
 * Description: Ping the bot :P
 * Command: ping
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
}