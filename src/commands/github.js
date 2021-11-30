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
        .setTitle('GitHub | CBG-Development/discord-bot')
        .setURL('https://github.com/CBG-Development/discord-bot')
        .setDescription('This is the official GitHub respository for our Discord-Bot')
        .setColor('#0081c6')
        .setThumbnail('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')
        .setImage('https://www.bbs-technik-koblenz.de/www/images/bilder/Logo/logo_2013.png');
        interaction.reply({embeds: [embet]})
    }
}