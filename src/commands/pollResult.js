/**
 * Library
 */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

 /**
 * Title: Poll Results
 * Command: rpoll
 * Description: Command for poll results. Shows every user
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpoll')
        .setDescription('Schickt eine private Nachricht mit allen Spielern die reagiert haben!')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('Message ID')
                .setRequired(true)),
    
    help: {
        title: '📉 Results Poll',
        description: 'Responses with a private message with all data of a poll'
    },
    
    permissions: [
        // Projektleitung
        { id: '905730518505644042', type: 'ROLE' },
        // Discord Administration
        { id: '905472488069292112', type: 'ROLE' }
    ],
    async execute(client, interaction) {
        const messageId = await interaction.options.getString('messageid');
        const reactions = [];
        const usersReplyMessage = [];

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            message.reactions.cache.each(value => reactions.push(value));

            for (const reaction of reactions) {
                const message = {
                    emoji: reaction.emoji.toString(),
                    count: reaction.count,
                    users: [],
                };

                const users = await reaction.users.fetch();
                users.forEach((value, key) => {
                    message.users.push(value);
                });
                usersReplyMessage.push(message);
            }
        } catch (error) {
            return await interaction.reply({
                content: 'Message does not contain any reactions!',
                ephemeral: true
            });
        }

        const replyEmbed = new MessageEmbed()
            .setColor("#1E90FF")
            .setTitle("Reaktion - Ergebnisse!")
            .setDescription("Hier sind die Ergebnisse der Reaktion.")
        
        for (const reaction of usersReplyMessage) {

            let content = "";
            for (user of reaction.users) {
                content += `<@${user.id}> \n`;
            }

            replyEmbed.addField(
                `${reaction.emoji} | Anzahl: ${reaction.count}`,
                content, 
                false
            )
        }

        await interaction.reply({
            embeds: [replyEmbed],
            ephemeral: true
        });
    }
}