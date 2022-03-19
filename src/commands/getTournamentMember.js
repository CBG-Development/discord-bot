const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction, Client } = require('discord.js');
const TournamentManager = require('../Tournament/TournamentManager');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('stournament')
        .setDescription('Sieh alle Anmeldungen für das Turnier.')
        .setDefaultPermission(true)
        .addStringOption(option =>
            option.setName('tournamentcode')
                .setDescription('Turniercode')
                .setRequired(true)
            ),
    
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
            const tournamentManager = client.tournamentManager;
            const tournament = tournamentManager.getTournament(await interaction.options.getString('tournamentcode'));
            const members = tournamentManager.getMembers(await interaction.options.getString('tournamentcode'));
            const replyEmbed = new MessageEmbed()
                .setAuthor('CBG | Tournaments', 'https://cdn.discordapp.com/attachments/909555660969111552/954397631608680518/Story-Cover_Tuniere.png', null)
                .setColor('#1E90FF')
                .setURL('https://carl-benz-gaming.de/')
                .setFooter("Carl Benz Gaming", "https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png")
                .setTimestamp(Date.now())
            
            if (members) {
                replyEmbed
                    .setTitle("Tournament - Anmeldungen")
                    .setDescription(`Hier sind alle Anmeldungen für ${tournament.title}.`)

                let replyFieldContent = "";
                members.forEach((value, index) => {
                    replyFieldContent += `<@${value.id}> - ${value.gamerTag} \n`;
                })

                if (replyFieldContent.length > 0) {
                    replyEmbed
                        .addField(`Anzahl: ${members.length}`, replyFieldContent);
                } else {
                    replyFieldContent = "keine Anmeldungen";
                    replyEmbed
                        .addField("Anzahl: 0", replyFieldContent);
                }
            } else {
                replyEmbed
                    .setTitle('Falscher TournamentCode 😢')
                    .setColor("#F40808")
                    .setDescription('Bitte überprüfe nochmal deinen TournamentCode und probiere es noch einmal.')
            }

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    }
}