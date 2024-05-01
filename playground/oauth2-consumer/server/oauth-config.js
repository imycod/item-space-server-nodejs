'use strict';

module.exports = {
	provider: {
		protocol: "http", 
		host: "localhost:3009",
		profileUrl: "/api/userinfo"
	}, 
	consumer: {
		protocol: "http", 
		host: "localhost:3002"
	}
};
