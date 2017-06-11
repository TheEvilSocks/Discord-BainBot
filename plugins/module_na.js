module.exports = {
	information : {
		moduleName : "us",
		description : "us - Set your region to the United States."
	},
	action : function (client, e) {

		if(!e.message.channel.isPrivate && e.message.channel.guild.id == "181079451986165760"){
			var roleName = "US";
			var roleID = null;
			var role = null;

			if(!roleID){
				role = client.Guilds.get("181079451986165760").roles.find(r=> r.name == roleName);
			}else{
				role = client.Guilds.get("181079451986165760").roles.find(r=> r.id == roleID);
			}

			e.message.channel.member.assignRole(role);

			if(message.channel.member.roles.filter(r=>r.name == "EU").length > 0)
				message.channel.member.unassignRole(message.channel.member.roles.find(r=>r.name == "EU"));
			if(message.channel.member.roles.filter(r=>r.name == "AU").length > 0)
				message.channel.member.unassignRole(message.channel.member.roles.find(r=>r.name == "AU"));
			
		}



	}
}
