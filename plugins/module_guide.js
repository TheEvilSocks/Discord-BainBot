module.exports = {
	information : {
		moduleName : "guide",
		description : "!guide - A link to The Long Guide"
	},
	action : function (client, e) {
		e.message.channel.sendMessage("**The Long Guide:** https://steamcommunity.com/sharedfiles/filedetails/?id=267214370");
	}
}
