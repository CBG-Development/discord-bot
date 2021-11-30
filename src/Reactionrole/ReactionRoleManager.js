const { Collection, Client, GuildEmoji, ReactionEmoji, Permissions} = require("discord.js");
const ReactionRole = require("./ReactionRole");
const fs = require('fs');

class ReactionRoleManager{

    constructor(){
        /**
         * @type {ReactionRole[]}
         */
        this.reactionRoles;

        this.load();
    }

    /**
     * 
     * @param {ReactionRole} reactionrole
     * @returns {ReactionRoleManager} this 
     */
    async push(reactionrole) {
        this.reactionRoles.push(reactionrole);
        
        this.save();
        return this;
    }


    /**
     * 
     * @param {*} messageid 
     * @param {*} emoteid 
     * @returns {ReactionRole[]}
     */
    get(messageid, emoji){
        let emojiid;

        if(emoji instanceof ReactionEmoji || emoji instanceof GuildEmoji){
		    if(emoji.id === null){
			    emojiid = emoji.name;
		    } else {
			    emojiid = emoji.id;
            }
		} else {
            emojiid = emoji;
        }
        

        const filter = i => {
			return i.emote === emojiid && i.messageid === messageid;
		}

        //look in list
		let reactionroles = this.reactionRoles.filter(filter);

        return reactionroles;
    }


    /**
     * Deleted all entries with this messageid
     * @param {*} messageid 
     */
    deleteMessageId(messageid){

        const filter = i => {
			return i.messageid !== messageid;
		}
        
		this.reactionRoles = this.reactionRoles.filter(filter);

        this.save();
    }


    save(){

        let data = JSON.stringify(this.reactionRoles);
		fs.writeFileSync('./reactionrole.json', data);
    }

    load(){

        let rawdata = fs.readFileSync('./reactionrole.json');
	    let data = JSON.parse(rawdata);
	   

        if(!(data instanceof Array)){
            this.reactionRoles = [];
        } else {
            this.reactionRoles = data;
            console.log("[Success] Loading reaction database was successfully!");
        }
    }
}

module.exports = ReactionRoleManager;