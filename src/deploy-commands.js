const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');
const fs = require('fs');
const dotenv = require('dotenv');

/**
 * Setting up Environment variables
 */
dotenv.config();

config['token'] = process.env.DISCORD_TOKEN;
config['clientId'] = process.env.DISCORD_CLIENT_ID;
config['guildId'] = process.env.DISCORD_GUILD_ID;


const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}


const rest = new REST({ version: '9' }).setToken(config['token']);

rest.put(Routes.applicationGuildCommands(config['clientId'], config['guildId']), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);