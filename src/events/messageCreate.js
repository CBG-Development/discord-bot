const VerificationManager = require('../Manager/VerificationManager');
const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
        if (!message.author.bot) {
            const client = message.client;

            /**
             * Check for Verification
             *
             * @type {VerificationManager}
             */
            const manager = client.verificationManager;
            const response = new MessageEmbed();
            if (message.channelId === manager.verificationChannelID) {
                const vCode = manager.getVCode(message.content);
    
                if (vCode !== undefined && !vCode?.used) {
                    const guildMember = await message.guild.members.fetch(message.author.id);
                    await guildMember.roles.add(manager.verificationRoleID);
    
                    /**
                     * Code entwerten
                     */
                    manager.addMember(vCode.id, message.author.id);
    
                    /**
                     * Loggen
                     */
                    manager.log(
                        new MessageEmbed()
                            .setTitle('✅ Verifizierung abgeschlossen.')
                            .setDescription(`<@${message.author.id}> wurde erfolgreich mit dem Code ${vCode.code} verifiziert.`)
                            .setTimestamp(Date.now()),
                        message.guild
                    )
    
                    response
                        .setTitle('✅ Verifizierung abgeschlossen.')
                        .setDescription('Die Verifizierung ist nun abgeschlossen und du wurdest als Projektmitglied verifiziert. Viel Spaß auf unserem Discord!')
                        .setColor('#29ff00')
                        .setTimestamp(Date.now())
                    
                    try {
                        await message.delete();
                        await message.author.send({ embeds: [response]});
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    response
                        .setTitle('❌ Verifizierungs Fehler.')
                        .setDescription('Leider konnten wir dich nicht Verifizieren. Bitte überprüfe deinen Code.\nCodes können nur **einmal** benutzt werden!\nBei weiteren Problemen eröffne bitte ein Ticket im <#933427888965943307> Bereich.')
                        .setColor('#ff0000')
                        .setTimestamp(Date.now())
    
                    try {
                        await message.delete();
                        await message.author.send({ embeds: [response]});
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }
	},
};