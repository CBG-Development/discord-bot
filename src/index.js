/**
 * Library
 */
const {Client, Collection, Intents} = require('discord.js');
const {token} = require('../config.json');
const fs = require('fs');
const deployCommands = require('./deploy-commands');

/**
 * Deploying Clients to Discord
 */
deployCommands;

/**
 * Creating Discord Bot Client
 */
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'], 
});

/* Read Commands */
client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
};

/* Check Interactions for command */
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        if (command.permissions !== undefined) {
            for (const id of command.permissions) {
                if (interaction.member.roles.cache.has(id)) {
                    await command.execute(interaction);
                    return;
                }
            }
            interaction.reply({ content: 'Keine Rechte!', ephemeral: true })
        } else {
            await command.execute(interaction);
        }

    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

/* Discord Bot is ready! */
client.once('ready', () => {
    console.log('Ready!');
});

/* Login Discord Client */
client.login(token);