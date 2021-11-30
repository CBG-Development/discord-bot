const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction} = require("discord.js");


/**
 * Title: Github
 * Description: Give the Github link
 * Command: github
 */
module.exports = {

    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('The Github link'),
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        if(!interaction.isCommand()) return;

        const embet = new MessageEmbed()
        .setTitle('Github')
        .setDescription('https://github.com/CBG-Development/discord-bot')
        .setColor('#0081c6');
        interaction.reply({embeds: [embet]})
    }
}