const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require('discord.js');
const { TournamentManager } = require('../Manager/VerificationManager');

/**
 * Title: Student Verification
 * Description: Verifies a student.
 * Command: verify
 */
 module.exports = {

    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifiziert einen Schüler.')
        .setDefaultPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Der zu verifizierende Schüler.')
            .setRequired(true)
        ),

    help: {
        title: 'Verifikation',
        description: 'Verifiziert einen Schüler.'
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
            const toVerify = await interaction.options.getUser('user');
            const guildMember = await interaction.guild.members.fetch(toVerify.id);
            await guildMember.roles.add('905843134565605386');
            console.log(toVerify);
            
            const replyEmbed = new MessageEmbed()
                .setAuthor('CBG | Verifikation', 'https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png', null)
                .setColor('#1E90FF')
                .setURL('https://carl-benz-gaming.de/')
                .setFooter("Carl Benz Gaming", "https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png")
                .setTimestamp(Date.now())
                .setTitle("Verifikation - Erfolgreich")
                .setDescription(`Der Schüler <@${toVerify.id}> wurde erfolgreich verifiziert.`);
                
            const verificationMessage = new MessageEmbed()
                .setAuthor('CBG | Verifikation', 'https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png', null)
                .setColor('#1E90FF')
                .setURL('https://carl-benz-gaming.de/')
                .setFooter("Carl Benz Gaming", "https://cdn.discordapp.com/attachments/905814305176428585/923249895786287124/Finished_Benz_trans_1.png")
                .setTimestamp(Date.now())
                .setTitle("Verifikation - Erfolgreich")
                .setDescription(`Du wurdest erfolgreich verifiziert.`)
                .addField("Verifiziert von", `<@${interaction.user.id}>`, true);

            await toVerify.send({ embeds: [verificationMessage] });
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        } catch(error) {
            console.error(error);
        }
    }
}