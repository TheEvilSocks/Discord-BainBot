var uidFromMention = /<@([0-9]+)>/;
module.exports = {
	information : {
		moduleName : "help"
	},
	lastTime : 0,
	cooldown : 1000,
	description : "!help - Shows all commands.\n!help <command> - Shows help about a command",
	permissions : {
		onlyMonitored : true
	},
	action : function (client, e) {
		var cmds_ = Object.keys(e.GLOBAL.commands).sort();
		var cmds = [];
		if(e.args[0]){
			if(e.args[0].startsWith("!"))
				e.args[0] = e.args[0].substring(1);
			if(e.GLOBAL.commands[e.args[0].toLowerCase()]){
				e.message.channel.sendMessage('**USAGE**\n`'+e.GLOBAL.commands[e.args[0].toLowerCase()].description+'`');
			}else{
				e.message.channel.sendMessage("I do not know that command.");		
			}
		}else{
			for(i=0;i<cmds_.length;i++){
				if(!e.GLOBAL.commands[cmds_[i]].hide && (!e.GLOBAL.commands[cmds_[i]].parent || e.GLOBAL.commands[cmds_[i]].parent == cmds_[i]))
					cmds.push(cmds_[i]);
			}
			
			
			
			e.message.author.openDM().then(function(channel){
				channel.sendMessage("**Available commands:**\n`!" + cmds.join("` `!") + "`\n\nUse `!help <command>` to find out what a command does.\nDo **not** include `[]` and `<>` in your commands. `[]` means something is optional, `<>` means something is required").then(function(){
					e.message.reply("📬 I've sent you a PM!");
				}, function(){
					e.message.channel.sendMessage("I couldn't PM you, probably because you blocked me.");
				});
			}, function(err){
				e.message.channel.sendMessage("I couldn't PM you, probably because you blocked me.");
			});
		}
	}
}
