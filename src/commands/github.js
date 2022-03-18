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

    help: {
        title: '<:github:915962481703280680> Github Repository',
        description: 'Sends a link of the official GitHub repository'
    },
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        if(!interaction.isCommand()) return;

        const embet = new MessageEmbed()
        .setTitle('GitHub | CBG-Development/discord-bot')
        .setURL('https://github.com/CBG-Development/discord-bot')
        .setDescription('This is the official GitHub respository for our Discord-Bot')
        .setColor('#0081c6')
        .setThumbnail('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')
        .setImage('https://bbs-technik-koblenz.de/wp-content/uploads/2021/11/logo-2x.png');
        interaction.reply({embeds: [embet]})
    }
}