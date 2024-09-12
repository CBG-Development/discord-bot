const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Interaction } = require('discord.js');
const genSimpleID = require('../tools/genSimpleID');
const { v4: uuidv4 } = require('uuid');

/**
 * Title: Verification
 * Description: Creates a verification code
 * Command: cverification
 */
module.exports = {

    data: new SlashCommandBuilder()
        .setName('cverification')
        .setDescription('Erstellt einen einmaligen Code zur Verifizierung eines neuen Users.')
        .setDefaultPermission(false),

    help: {
        title: '✅ Verifizierung',
        description: 'Erstellt einen einmaligen Code zur Verifizierung eines neuen Users.'
    },

    permissions: [
        // Projektleitung
        { id: '905730518505644042', type: 'ROLE' },
        // Discord Administration
        { id: '905472488069292112', type: 'ROLE' }
    ],

    /**
     * Execute
     * @param {Client} client
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {

        const vCode = { 
            id: uuidv4(),
            code: genSimpleID('CBG'),
            generatedAt: Date.now()
        }
        client.verificationManager.addVCode(vCode);

        const response = new MessageEmbed()
            .setTitle('✅ Verifizierung')
            .addField('ID', ("`" + vCode.id + "`"))
            .addField('Generierter Code', ("`" + vCode.code + "`"))
            .setColor('#29ff00')
            .setTimestamp(vCode.generatedAt)

        const log = new MessageEmbed()
            .setDescription(`Ein Code wurde von <@${interaction.user.id}> generiert.`)
            .setTitle('✅ Verifizierung')
            .addField('ID', ("`" + vCode.id + "`"))
            .addField('Generierter Code', ("`" + vCode.code + "`"))
            .setTimestamp(vCode.generatedAt)

        client.verificationManager.log(log, interaction.guild)

        await interaction.reply({
            embeds: [response],
            ephemeral: true
        });
    }
}