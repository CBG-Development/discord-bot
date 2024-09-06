# Carl Benz Gaming - Discord-Bot
## About
This is the official Discord Bot of the Carl Benz Gaming Discord that uses [Discord.JS](https://discord.js.org/) and [Node.js](https://nodejs.org/).
## Installation
Because of Discord.JS this app requires Node.js 16.6.0 or newer.

Install all required node modules with:

    npm install

Second step is to create an [Discord Application](https://discord.com/developers/applications). Afterwards create a Bot and copy these Informations:

 - Application ID
 - Token
 - Guild ID

Third step create an `.env` file at the project folder. Paste the information that you copied in the last step:

    DEBUG=false
    
    DISCORD_TOKEN=YOURTOKEN
    DISCORD_CLIENT_ID=APPID
    DISCORD_GUILD_ID=GUILDID

Start the app in production mode with

    npm start DISCORD_TOKEN=<YOURTOKEN> DISCORD_CLIENT_ID=<YOUR_CLIENT_ID> DISCORD_GUILD_ID=<DISCORD_GUILD_ID>

Test it in development mode with

    npm test

## Usage
All commands are registrated during Discord's API. So check them up with `/`.