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

Third step create an `config.json` file at the project folder. Paste the information that you copied in the last step:

    {
	    "token":  "TOKEN",
        "clientId":  "APPLICATION ID",
        "guildId":  "GUILD ID"
	}

Start the app with

    npm start

## Usage
All commands are registrated during Discord's API. So check them up with `/`.