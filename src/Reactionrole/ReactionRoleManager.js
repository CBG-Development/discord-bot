const { Collection, Client, GuildEmoji, ReactionEmoji, Permissions} = require("discord.js");
const ReactionRole = require("./Reactionrole");
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
            console.log(data);
        }

    }

    
    /**
     * 
     * @param {Client} client 
     */
    /*
    async reloadPermission(client){
        console.log('[Stared] reloaded Permissions');
	
        //get the guild
        let guild = client.guilds.resolve(guildId);
            
        //get the command list
        let commandlist = await guild.commands.fetch();

    
        //permisiton for the @everyon role
        const peveryone =  {
            id: guild.roles.everyone.id,
            type: 'ROLE',
            permission: true,
        };
    
        //permission for everye role with admin permison
        let pAdmin = [];
        
        //fill the list
        let roles = await guild.roles.fetch();
        roles.forEach(role => {
            if(role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
                pAdmin.push({
                    id: role.id,
                    type: 'ROLE',
                    permission: true,
                });
            }
        })
    
        //creat owner permision
        const pOwner = {
            id: guild.ownerId,
            type: 'USER',
            permission: true
        }
        pAdmin.push(pOwner);
    
        //set the permison for eche Command
        commandlist.forEach(slashCommand => {
            console.log(`Canging command ${slashCommand.name}: ${slashCommand.id} on ${slashCommand.guild.name}: ${slashCommand.guild.id}`);
    
            
            if(slashCommand.name === 'reactionrole'){
                guild.commands.permissions.set({
                    command: slashCommand.id,
                    permissions: pAdmin
                });
            } else {
                guild.commands.permissions.set({
                    command: slashCommand.id,
                    permissions: [peveryone, pOwner]
                });
            }
            
        })
    
        console.log('[Finished] reloaded Permissions');
    }

    */
}

module.exports = ReactionRoleManager;