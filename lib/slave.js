var request = require("request");
var auth = require("../config/auth.json").slave;

var slaveTokens = auth.tokens;

module.exports = {
	join: function(inviteCode, callback){
		request.post({
            url: "https://canary.discordapp.com/api/v6/invites/" + inviteCode,
            headers: {
                'authorization': auth.discord.token
            }
        }, function(err, response, body) {
            try {
                if(err || response.statusCode != 200) {
                	console.log(err || response.statusCode);
                    callback(err || response.statusCode);
                    return;
                }

                var u = JSON.parse(body);
				callback(undefined, u);
            } catch(e) {
                callback(e);
            }

        });
	},
	leave: function(inviteCode, callback){
		request.post({
            url: "https://canary.discordapp.com/api/v6/invites/" + inviteCode,
            headers: {
                'authorization': auth.discord.token
            }
        }, function(err, response, body) {
            try {
                if(err || response.statusCode != 200) {
                	console.log(err || response.statusCode);
                    callback(err || response.statusCode);
                    return;
                }

                var u = JSON.parse(body);
				callback(undefined, u);
            } catch(e) {
                callback(e);
            }

        });
	}
}
