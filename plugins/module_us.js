module.exports = {
	information : {
		moduleName : "us",
		description : "us - Set your region to the United States."
	},
	action : function (client, e) {

		if(!e.message.channel.isPrivate && e.message.channel.guild.id == "181079451986165760"){
			var roleName = "US";
			var role = client.Guilds.get("181079451986165760").roles.filter(r=> r.name == roleName)[0]

			e.message.member.assignRole(role.id);
			e.message.channel.sendMessage("You have assigned yourself to the US region");

			if(e.message.member.roles.filter(r=>r.name == "EU").length > 0)
				e.message.member.unassignRole(e.message.member.roles.filter(r=>r.name == "EU")[0]);
			if(e.message.member.roles.filter(r=>r.name == "AU").length > 0)
				e.message.member.unassignRole(e.message.member.roles.filter(r=>r.name == "AU")[0]);
			
		}



	}
}
