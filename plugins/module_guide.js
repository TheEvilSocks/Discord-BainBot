module.exports = {
	information : {
		moduleName : "guide"
	},
	lastTime : 0,
	cooldown : 3000,
	description : "!guide - A link to The Long Guide",
	permissions : {
		onlyMonitored : true
	},
	action : function (client, e) {
		e.message.channel.sendMessage("**The Long Guide:** https://steamcommunity.com/sharedfiles/filedetails/?id=267214370");
	}
}
