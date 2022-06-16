const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const genSimpleID = require('../tools/genSimpleID');
const TournamentManager = require('../Manager/TournamentManager');

/**
 * Title: Tournament
 * Description: Create a Tournament
 * Command: tournament
 */
 module.exports = {

    data: new SlashCommandBuilder()
        .setName('ctournament')
        .setDescription('Erstellt ein Turnier mit einem Turniercode.')
        .setDefaultPermission(false),

    help: {
        title: '<:turnier:915962481703280680> Turniere erstellen',
        description: 'Erstellt ein Turnier mit einem Turniercode um diesem beizutreten.'
    },

    permissions: [
        // Projektleitung
        { id: '905730518505644042', type: 'ROLE' },
        // Discord Administration
        { id: '905472488069292112', type: 'ROLE' },
        // Arbeitspaket Leitung
        { id: '909763190970281985', type: 'ROLE' },
        // Turniermanagement
        { id: '908460036257374269', type: 'ROLE' }
    ],
    /**
     * Execute
     * @param {Client} client
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        try {
            let creationIndex = 0;

            const tournament = {
                id: genSimpleID("TR"),
                channelId: null,
                game: null,
                date: null,
                time: null,
                title: null,
                description: null,
                banner: null,
                members: []
            };

            const games = [
                'Leauge of Legends',
                'Valorant',
                'CS:GO',
                'Dota 2',
                'StarCraft II',
                'WarCraft III',
                'Fortnite',
                'Rocket League',
                'Fifa',
                'Overwatch',
                'Rainbow Six Siege'
            ];

            const getGameOption = () => {
                const optionsGames = [];
                games.forEach((game, index) => {
                    optionsGames.push({
                        label: game,
                        value: game 
                    });
                });
                return optionsGames;
            };

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
            };

            const getCategoryOption = () => {
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
            };

            const embed = new MessageEmbed()
                .setTitle('Tournament erstellen')
                .setDescription('Wähle den Channel aus worin der Channel für die Nachricht exisitiert.');

            let components = [ 
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('category')
                            .setPlaceholder('Kategorie')
                            .setOptions(getCategoryOption())
                ),
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('cancel')
                            .setLabel('Abbrechen')
                            .setStyle('DANGER')
                            .setEmoji('❌')
                    )
            ];
            
            await interaction.reply({
                embeds: [embed],
                components: components,
                ephemeral: true
            });

            const filterComponent = component => component.user.id === interaction.user.id;
            const collectorComponent = interaction.channel.createMessageComponentCollector({ filter: filterComponent, time: 300000 });
            const filterMessage = message => message.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter: filterMessage, time: 300000 })

            collectorComponent.on('collect', async i => {
                if (i.customId === "cancel") {
                    await i.update({ content: "**Tournamenterstellung abgebrochen**", embeds: [], components: [] });
                    collectorComponent.stop();
                    collector.stop();
                }

                if (i.customId === "create") {
                    /**
                     * @type {TournamentManager}
                     */
                    const tournamentManager = client.tournamentManager;
                    tournamentManager.addTournament(tournament);

                    informationEmbed = new MessageEmbed()
                        .setAuthor('CBG | Tournaments', 'https://cdn.discordapp.com/attachments/909555660969111552/954397631608680518/Story-Cover_Tuniere.png', null)
                        .setTitle(tournament.title)
                        .setDescription(tournament.description)
                        .setURL('https://carl-benz-gaming.de/')
                        .setColor("#0065d3")
                        .addField("Zeitpunkt", ("`" + tournament.date + "` **|** `" + tournament.time + "Uhr`"))
                        .addField("Spiel", ("`" + tournament.game + "`"))
                        .addField("TournamentID", "`" + tournament.id + "`")
                        .setImage(tournament.banner)
                        .setFooter("Carl Benz Gaming", "https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png")
                        .setTimestamp(Date.now())
                    
                    const targetChannel = await interaction.guild.channels.fetch(tournament.channelId);
                    await targetChannel.send({ embeds: [informationEmbed] });

                    await i.update({ content: "**Tournament erstellt**" });
                    collectorComponent.stop();
                    collector.stop();
                }

                if (i.customId === "category") {
                    let categoryId;
                    categoryId = i.values[0];

                    const category = await interaction.guild.channels.fetch(categoryId);

                    components = [ 
                        new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('channel')
                                    .setPlaceholder('Channels')
                                    .setOptions(await getChannelOption(category))
                            ),
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('Abbrechen')
                                    .setStyle('DANGER')
                                    .setEmoji('❌')
                            )
                        
                    ];

                    await i.update({ components });
                    creationIndex++;
                }

                if (i.customId === "channel") {
                    tournament.channelId = i.values[0];

                    embed.setDescription("Wählen sie das Tournament Game aus.");

                    components = [ 
                        new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('game')
                                    .setPlaceholder('Games')
                                    .setOptions(getGameOption())
                            ),
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('Abbrechen')
                                    .setStyle('DANGER')
                                    .setEmoji('❌')
                            )
                    ];

                    await i.update({ embeds: [embed], components: components });
                    creationIndex++;
                }

                if (i.customId === "game") {
                    tournament.game = i.values[0];

                    embed.setDescription("Geben sie das Datum ein. (DD-MM-YYYY)");

                    components = [ 
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('Abbrechen')
                                    .setStyle('DANGER')
                                    .setEmoji('❌')
                            )
                    ];

                    await i.update({ embeds: [embed], components: components});
                    creationIndex++;
                }
            });

            const getDate = (dateString) => {
                const dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
                return dateRegex.test(dateString) ? dateString : false;
            }
            const getTime = (timeString) => {
                const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g;
                return timeRegex.test(timeString) ? timeString : false;
            }

            collector.on('collect', async (message) => {

                switch(creationIndex) {
                    case 3:
                        const date = getDate(message.content);

                        if (date) {
                            tournament.date = date;
        
                            embed.setDescription("Geben sie die Uhrzeit ein. (HH:MM)");
        
                            await interaction.editReply({ embeds: [embed] });
                            await message.delete();
                            creationIndex++;
                        } else {
                            embed.setDescription("Du hast das falsche Format benutzt. Schreibe es nochmal hinein.\nBeispiel: 18.03.2022")
                            await message.delete();
                        }
                        break;

                    case 4:
                        const time = getTime(message.content);

                        if (time) {
                            tournament.time = time;
        
                            embed.setDescription("Geben sie nun den Titel des Tuniers an.");
        
                            await interaction.editReply({ embeds: [embed] });
                            await message.delete();
                            creationIndex++;
                        } else {
                            embed.setDescription("Du hast das falsche Format benutzt. Schreibe es nochmal hinein.\nBeispiel: 15:03")
                            await message.delete();
                        }
                        break;

                    case 5:
                        tournament.title = message.content;
                        embed.setDescription("Geben sie dem Turnier nun eine Beschreibung.")
                        
                        await interaction.editReply({ embeds: [embed] });
                        await message.delete();
                        creationIndex++;
                        break;
                    
                    case 6:
                        tournament.description = message.content;
                        embed.setDescription("Geben sie wenn sie möchten noch die URL zu einem Bild an. Dies wird das Banner. \nWenn sie kein Banner möchten bestätigen sie einfach.")
                        
                        components = [ new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('create')
                                    .setLabel('Erstellen')
                                    .setStyle('SUCCESS')
                                    .setEmoji('✅'),
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('Abbrechen')
                                    .setStyle('DANGER')
                                    .setEmoji('❌')
                            )
                        ];

                        await interaction.editReply({ embeds: [embed], components});
                        await message.delete();
                        creationIndex++;
                        break;

                    case 7:
                        tournament.banner = message.content;
                        embed.setDescription("Bitte bestätigen sie nun.");

                        await interaction.editReply({ embeds: [embed], components});
                        await message.delete();
                        creationIndex++;
                        break;
                }
            })
        } catch(error) {
            console.error(error);
        }
    }
}