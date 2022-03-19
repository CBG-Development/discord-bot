const fs = require("fs");

class TournamentManager {

    constructor() {
        /**
         * @type {Object[]}
         */
        this.tournaments;
        this.load();
    }

    /**
     * Gets specific tournament with id
     * @param {string} id 
     * @return {Object}
     */
    getTournament(id) {
        const tournament = this.tournaments.filter(i => { return i.id === id; });
        return tournament.length > 0 ? tournament[0] : undefined;
    }

    /**
     * Adds a tournament
     * @param {Object} tournament 
     */
    addTournament(tournament) {
        this.tournaments.push(tournament);
        this.save();
    }

    /**
     * Adds a member to the tournament
     * @param {Object} member 
     */
    addMember(id, member) {
        this.tournaments.forEach((value, index) => {
            if (value.id === id) {
                this.tournaments[index].members.push(member);
                this.save();
            }
        })
    }

    /**
     * Get Members
     * @param {string} id
     */
    getMembers(id) {
        const tournament = this.getTournament(id);
        return tournament?.members;
    }

    save() {
        const data = JSON.stringify(this.tournaments);
        fs.writeFileSync('./tournaments.json', data);
    }

    load() {

        const rawdata = fs.readFileSync('./tournaments.json');
        const data = JSON.parse(rawdata);

        if(!(data instanceof Array)){
            this.tournaments = [];
        } else {
            this.tournaments = data;
            console.log("[Success] Loading tournament database was successfully!");
        }
    }
}

module.exports = TournamentManager;