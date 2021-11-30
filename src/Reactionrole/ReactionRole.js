class ReactionRole {
    constructor(messageid, emote, roleid) {
        /**
         * @name messageid
         * @description The Message id of the Message
         */
        this.messageid = messageid;
        /**
         * @name emote
         * @description it is the unicode of the emot ore the id
         */
        this.emote = emote;
        this.roleid = roleid;

    }

}


module.exports = ReactionRole;
