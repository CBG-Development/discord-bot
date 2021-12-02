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

    help: {
        title: '🏓 Ping!',
        description: 'Bot replies with Ping!'
    },
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        await interaction.reply('Moin!');
    }
}