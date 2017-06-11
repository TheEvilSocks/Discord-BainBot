module.exports = {
	information : {
		moduleName : "notlookingtoplay",
		description : "notlookingtoplay - You're no longer looking for a game."
	},
	aliases: ['nlfg'],
	action : function (client, e) {

		if(!e.message.channel.isPrivate && e.message.channel.guild.id == "181079451986165760"){
			var roleName = "Looking to play";
			var role = client.Guilds.get("181079451986165760").roles.filter(r=> r.name == roleName)[0]


			if(e.message.member.roles.filter(r => r.id == role.id).length > 0){
				e.message.channel.sendMessage("You weren't looking for a game to begin with.");
				return;
			}
			e.message.member.unassignRole(role.id);
			e.message.channel.sendMessage("You're no longer looking for a game.");
		}



	}
}
