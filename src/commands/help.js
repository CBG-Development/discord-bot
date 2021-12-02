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
    async execute(client, interaction) {

        if(!interaction.isCommand()) return;

        const commands = client.commands;

        const embet = new MessageEmbed()
        .setTitle('CBG | Help')
        .setDescription('Here are some of the listed commands')
        .setColor('#0081c6');

        for ([key, command] of commands) {
            if (command.help !== undefined) embet.addField(command.help.title, command.help.description, true);
        }

        interaction.reply({embeds: [embet]})
    }
}