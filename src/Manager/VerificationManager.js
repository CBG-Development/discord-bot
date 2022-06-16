const fs = require("fs");

class TournamentManager {

    constructor() {
        /**
         * @type {Object[]}
         */
        this.vCodes;
        this.logChannelID = '986953653728473118';
        this.verificationChannelID = '986958544043651082';
        this.verificationRoleID = '905843134565605386'
        this.load();
    }

    async getLogChannel(guild) {
        const channel = await guild.channels.fetch(this.logChannelID);
        return channel;
    }

    async log(embed, guild) {
        embed
            .setColor('#ff8500')
            .setFooter("Logs")

        const channel = await this.getLogChannel(guild)
        channel.send({ embeds: [embed] })
    }

    /**
     * Gets specific tournament with id
     * @param {string} id 
     * @return {Object}
     */
    getVCode(code) {
        const vCode = this.vCodes.filter(i => { return i.code === code; });
        return vCode.length > 0 ? vCode[0] : undefined;
    }

    /**
     * Adds a code
     * @param {Object} tournament 
     */
    addVCode(vCode) {
        this.vCodes.push(vCode);
        this.save();
    }

    /**
     * Adds a member to vcode
     * @param {Object} member 
     */
    addMember(id, member) {
        this.vCodes.forEach((value, index) => {
            if (value.id === id) {
                this.vCodes[index].used = {
                    used: true,
                    member: member,
                    date: Date.now()
                }
                this.save();
            }
        })
    }

    save() {
        const data = JSON.stringify(this.vCodes);
        fs.writeFileSync('./vCodes.json', data);
    }

    load() {

        const rawdata = fs.readFileSync('./vCodes.json');
        const data = JSON.parse(rawdata);

        if(!(data instanceof Array)){
            this.vCodes = [];
        } else {
            this.vCodes = data;
            console.log("[Success] Loading vCodes database was successfully!");
        }
    }
}

module.exports = TournamentManager;