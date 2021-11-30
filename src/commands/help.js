const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction} = require("discord.js");


/**
 * Title: Help
 * Description: Give u help  
 * Command: help
 */
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows Help'),
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        if(!interaction.isCommand()) return;

        const embet = new MessageEmbed()
        .setTitle('Help')
        .setDescription('Here is some Help')
        .setColor('#0081c6');
        interaction.reply({embeds: [embet]})
    }
}