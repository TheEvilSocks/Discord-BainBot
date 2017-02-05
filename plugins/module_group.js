var fs = require('fs');

module.exports = {
	information : {
		moduleName : "group",
		description : "group add <group> <user> - Adds a user to a group"
	},
	hide: true,
	action : function (client, e) {
		if (client.Channels.getBy('id', e.message.channel_id)) {

			if(!e.args[0] || !e.args[1] || !e.args[2]){
				e.message.reply('**USAGE**\n' + module.exports.information.description);
				return;
			}
			e.args[2] = e.args.splice(2).join(" ");
			if(client.Users.getBy('username', e.args[2])){
				e.args[2] = '<@' + client.Users.getBy('username', e.args[2]).id + '>';
			}

			if(client.Users.getBy('id', e.args[2])){
				e.args[2] = '<@' + client.Users.getBy('id', e.args[2]).id + '>';
			}

			if(e.args[0].toLowerCase() == 'add'){
				if (e.args[2] && e.args[2].match(/<@!?([0-9]+)>/) != null) {
					if (e.args[2].match(/<@!?([0-9]+)>/)[1] == parseInt(e.args[2].match(/<@!?([0-9]+)>/)[1])) {
						if (client.Users.getBy('id', e.args[2].match(/<@!?([0-9]+)>/)[1].toString())) {
							if (userDB[e.args[2].match(/<@!?([0-9]+)>/)[1].toString()]) {
								if(userDB[e.args[2].match(/<@!?([0-9]+)>/)[1].toString()].groups.indexOf(e.args[1]) > -1){
									e.message.channel.sendMessage("That user is already in that group.");
									return;
								}
								userDB[e.args[2].match(/<@!?([0-9]+)>/)[1].toString()].groups.push(e.args[1]);
								fs.writeFile("./db/users.json", JSON.stringify(userDB).replace(/`/g, '\u200B`'), function (error) {
									if (error) {
										e.message.channel.sendMessage("Something went wrong when saving")
									}else{
										e.message.channel.sendMessage('Added ' + client.Users.getBy('id',e.args[2].match(/<@!?([0-9]+)>/)[1].toString()).username + ' to group ' + e.args[1]);
									}
								});
							} else {
								e.message.channel.sendMessage("idk that user.")
							}
						} else {
							e.message.channel.sendMessage("I do not know that user.")
						}

					}else{
						e.message.channel.sendMessage('User not valid');
					}
				}else{
					e.message.channel.sendMessage('User not valid');
				}
			}
		}
	}
}
