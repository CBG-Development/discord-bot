/**
 * Library
 */
const {Client, Collection, Intents} = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const deployCommands = require('./deploy-commands');
const api = require('./api');
const ReactionRoleManager = require('./Reactionrole/ReactionRoleManager');
const { reloadPermission } = require('./reloadPermission');
const TournamentManager = require('./Manager/TournamentManager');
const VerificationManager = require('./Manager/VerificationManager')

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

/**
 * Environment Variables
 * 
 * Token
 * process.env.DISCORD_TOKEN
 * 
 * Client ID
 * process.env.DISCORD_CLIENT_ID
 * 
 * Guild ID
 * process.env.DISCORD_GUILD_ID
 * 
 * DEBUG Mode
 * process.env.DEBUG
 */

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
    if (command.data) {
        client.commands.set(command.data.name, command);
    }
};

/* Read Events */

const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/* Sets the reloadPermission function*/ 
client.reloadPermission = reloadPermission;

/* Check Interactions for command */
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

/* Discord Bot is ready! */
client.on('ready', async () => {

    client.reactionRoleManager = new ReactionRoleManager();
    client.tournamentManager = new TournamentManager();
    client.verificationManager = new VerificationManager();

    //client.reloadPermission(client, client.guilds.cache.get(process.env.DISCORD_GUILD_ID), process.env.DISCORD_TOKEN);

    global.botStatus = true; // Set Bot status to connected (true)
    console.log(`${client.user.tag} is connected to Discord!`);
});

/* Login Discord Client */
client.login(process.env.DISCORD_TOKEN);