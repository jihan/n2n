"use strict";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.on("message",
	function(msg, rinfo) {
		console.log("from: " + rinfo.address + ":" + rinfo.port + "\nmsg: " + msg + "[" + Date.now() + "]" );
	}
);

server.on("listening",
	function() {
		var endPoint = server.address();
		console.log(endPoint.address + ":" + endPoint.port);
	}
);

server.bind(7119);

