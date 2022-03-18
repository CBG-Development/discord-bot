const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction, MessageActionRow, MessageButton, MessageSelectMenu, GuildChannel, CategoryChannel } = require('discord.js');
const { v4: uuid } = require("uuid");

/**
 * Title: Tournament
 * Description: Create a Tournament
 * Command: tournament
 */
 module.exports = {

    data: new SlashCommandBuilder()
        .setName('tournament')
        .setDescription('Create a tournament')
        .setDefaultPermission(false),

    help: {
        title: '<:github:915962481703280680> Github Repository',
        description: 'Sends a link of the official GitHub repository'
    },

    permissions: [
        // Projektleitung
        { id: '905730518505644042', type: 'ROLE' },
        // Discord Administration
        { id: '905472488069292112', type: 'ROLE' },
        // Arbeitspaket Leitung
        { id: '909763190970281985', type: 'ROLE' },
    ],
    /**
     * Execute
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        try {
            const tournament = {
                tournamentId: uuid(),
                channelId: null,
                game: null,
                date: null,
                time: null,
                reaction: {
                    message: null,
                    emoji: null
                }
            }

            const getChannelOption = async (category) => {
                const channels = [];

                category.children.forEach((value, key) => {
                    if (value.isText()) {
                        channels.push({ 
                            label: value.name,
                            value: value.id
                        });
                    }
                })

                return channels;
            }

            const getCategoryOption = async () => {
                const categories = [];
                interaction.guild.channels.cache.forEach((value, key) => {
                    if (value.type === "GUILD_CATEGORY") {
                        categories.push({
                            label: value.name,
                            value: value.id
                        })
                    }
                })
                return categories;
            }

            const embed = new MessageEmbed()
                .setTitle('Tournament erstellen')
                .setDescription('Wähle den Channel aus worin der Channel für die Nachricht exisitiert.')

            const components = [ new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('category')
                        .setPlaceholder('Kategorie')
                        .addOptions(await getCategoryOption())
                )
            ];
            
            await interaction.reply({
                embeds: [embed],
                components: components,
                ephemeral: true
            })

            const filterComponent = component => component.user.id === interaction.user.id;
            const collectorComponent = interaction.channel.createMessageComponentCollector({ filter: filterComponent, componentType: 'SELECT_MENU', time: 60000 })

            collectorComponent.on('collect', async i => {
                if (i.customId === "category") {
                    let categoryId;
                    categoryId = i.values[0];

                    const category = await interaction.guild.channels.fetch(categoryId);

                    components.push( new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('channel')
                                .setPlaceholder('Channels')
                                .addOptions(await getChannelOption(category))
                        )
                    );

                    await i.update({ components: components });
                }
            })
        } catch(error) {
            console.error(error);
        }
    }
}