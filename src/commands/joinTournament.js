const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction, Client } = require('discord.js');
const TournamentManager = require('../Manager/TournamentManager');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('jtournament')
        .setDescription('Trete einem Turnier bei mit dem Turniercode.')
        .setDefaultPermission(true)
        .addStringOption(option =>
            option.setName('tournamentcode')
                .setDescription('Turniercode')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('gamertag')
                .setDescription('Dein GamerTag in dem Spiel')
                .setRequired(true)
            ),

    help: {
        title: '<:turnier:915962481703280680> Turnier beitreten',
        description: 'Trete einem Turnier mit einem Turniercode bei. Gebe ebenfalls deinen UserTag an.'
    },

    /**
     * Execute
     * @param {Client} client
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        try {
            const member = {
                id: interaction.user.id,
                gamerTag: await interaction.options.getString('gamertag'),
                timestamp: Date.now()
            }

            const embed = new MessageEmbed()
                .setAuthor('CBG | Tournaments', 'https://cdn.discordapp.com/attachments/909555660969111552/954397631608680518/Story-Cover_Tuniere.png', null)
                .setColor('#1E90FF')
                .setURL('https://carl-benz-gaming.de/')
                .setFooter("Carl Benz Gaming", "https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png")
                .setTimestamp(Date.now())

            /**
             * @type {TournamentManager}
             */
            const tournamentManager = client.tournamentManager;
            const tournament = tournamentManager.getTournament(interaction.options.getString('tournamentcode'));
            
            if (tournament) {
                tournamentManager.addMember(interaction.options.getString('tournamentcode'), member);

                embed
                    .setTitle('Anmeldung erfolgreich')
                    .setColor('#00FC26')
                    .addField('Turnierinformationen', (`**${tournament.title}** \n${tournament.description} \nZeitpunkt: ${tournament.date} - ${tournament.time} \nSpiel: ${tournament.game}`))
                    .setImage(tournament.banner)
            } else {

                embed
                    .setTitle('Falscher TournamentCode 😢')
                    .setColor("#F40808")
                    .setDescription('Bitte überprüfe nochmal deinen TournamentCode und probiere es noch einmal.')
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    }
}