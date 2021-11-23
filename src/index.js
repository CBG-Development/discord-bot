/**
 * Library
 */
const {Client, Collection, Intents} = require('discord.js');
const config = require('../config.json');
const dotenv = require('dotenv');
const fs = require('fs');
const deployCommands = require('./deploy-commands');
const api = require('./api');

/**
 * Host constants
 */
global.port = 3030;
global.host = '0.0.0.0';

/**
 * Status of the Bot
 * true = connected to discord
 * false = connection error
 */
global.botStatus = false;

/**
 * Setting up Environment variables
 */
dotenv.config();

config['token'] = process.env.DISCORD_TOKEN;
config['clientId'] = process.env.DISCORD_CLIENT_ID;
config['guildId'] = process.env.DISCORD_GUILD_ID;

process.env.DEBUG ? config['debug'] = true : config['debug'] = false;

/**
 * Starting API
 */
api;

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
client.on('ready', () => {
    global.botStatus = true; // Set Bot status to connected (true)
    console.log(`${client.user.tag} is connected to Discord!`);
});

/* Login Discord Client */
client.login(client.token);