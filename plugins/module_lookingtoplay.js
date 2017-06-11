module.exports = {
	information : {
		moduleName : "lookingtoplay",
		description : "lookingtoplay - If you're currently looking to play some games."
	},
	aliases: ['lfg'],
	action : function (client, e) {

		if(!e.message.channel.isPrivate && e.message.channel.guild.id == "181079451986165760"){
			var roleName = "Looking to play";
			var role = client.Guilds.get("181079451986165760").roles.filter(r=> r.name == roleName)[0]


			if(e.message.member.roles.filter(r => r.id == role.id).length > 0){
				e.message.channel.sendMessage("You're already looking for a game.");
				return;
			}
			e.message.member.assignRole(role.id);
			e.message.channel.sendMessage("You're now looking for a game.");
		}



	}
}
