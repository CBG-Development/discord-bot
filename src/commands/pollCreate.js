/**
 * Library
 */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, MessageActionRow, MessageButton } = require('discord.js');
const wait = require('util').promisify(setTimeout);

 /**
 * Title: Create Poll
 * Command: cpoll
 * Description: Command for creating polls with reaction
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('cpoll')
        .setDescription('Erstelle Umfragen in einem Text-Channel')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('theme')
                .setDescription('Thema der Umfrage')
                .setRequired(true)),

    help: {
        title: '🗳️ Creates a Poll',
        description: 'Creates a poll with emoji reaction. (Custom Emojis are allowed)'
    },

    permissions: [
        // Projektleitung
        { id: '905730518505644042', type: 'ROLE' },
        // Discord Administration
        { id: '905472488069292112', type: 'ROLE' }
    ],
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        
        /**
         * Get Answer as an element
         * @param {String} string 
         */
        const getAnswerElements = (string) => {
            const emoji = string.split(' ')[0];
            const regexEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
            
            //old: /(<a?)?:\w+:(\d{18}>)?/g
            const regexEmojiDiscord = /(<a?):\w+:(\d{18}>)/g;

            const answer = string.replace(emoji, '');
            
            if (regexEmoji.test(emoji) || regexEmojiDiscord.test(emoji)) {
                if (answer.length > 0) {
                    return { 
                        emoji: emoji,
                        answer: answer
                    };
                } else return null;
            } else return null;
        }

        try {
            const theme = await interaction.options.getString('theme')
            const answers = [];
            const embed = new MessageEmbed()
                .setTitle('Umfrage erstellen')
                .setDescription(`Frage: ${theme}`)
                .addField('Antwortmöglichkeiten', "schreibe den Emoji mit der Antwortmöglichkeit", false);

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('create')
                        .setLabel('Erstellen')
                        .setStyle('SUCCESS')
                        .setEmoji('✅'),
                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Löschen')
                        .setStyle('DANGER')
                        .setEmoji('❌')
                );

            const filterMessage = message => message.author.id === interaction.user.id;
            const filterComponent = component => component.user.id === interaction.user.id;

            interaction.reply({
                embeds: [ embed ],
                ephemeral: true
            });
            
            const collector = interaction.channel.createMessageCollector({ filter: filterMessage, time: 60000 })
            const collectorComponent = interaction.channel.createMessageComponentCollector({ filter: filterComponent, componentType: 'BUTTON', time: 60000 })

            collector.on('collect', async message => {
                const answerE = getAnswerElements(message.content);

                if (answerE !== null) {
                    /**
                     * Collect answer
                     */
                    answers.push(answerE);

                    /**
                     * Edit embed
                     */
                    let answersPos = "";
                    for (const answer of answers) {
                        answersPos += `${answer.emoji} - ${answer.answer}\n`;
                    }
                    embed.fields[0].value = answersPos;
                    if (answers.length > 0) {
                        interaction.editReply({ embeds: [ embed ], components: [ buttons ], ephemeral: true });
                    } else {
                        interaction.editReply({ embeds: [ embed ] });
                    }
                    
                    /**
                     * Clean Up
                     */
                    await message.delete();
                } else {
                    await message.delete();
                }
            })

            collectorComponent.on('collect', async i => {
                if (i.customId === 'create') {
                    collector.stop();

                    let answersPos = "";
                    for (const answer of answers) {
                        answersPos += `${answer.emoji} - ${answer.answer}\n`;
                    }
                    embed.fields[0].value = answersPos;

                    const pollEmbed = new MessageEmbed()
                        .setTitle(theme)
                        .setDescription(answersPos)

                    const pollMessage = await interaction.channel.send({ embeds: [pollEmbed] })
                    
                    for (const answer of answers) {
                        pollMessage.react(answer.emoji);
                        wait(1000);
                    }

                    const resultEmbed = new MessageEmbed()
                        .setTitle('Umfrage erstellt!')

                    await i.deferUpdate();
                    await interaction.editReply({ embeds: [resultEmbed], components: [] })
                }
                if (i.customId === 'cancel') {
                    await i.deferUpdate();
                    await interaction.editReply({ content: "**Umfragenerstellung abgebrochen**", embeds: [], components: [] });
                }
            })
        } catch (err) {
            console.error(err);
        }
    }
}