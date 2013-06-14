"use strict";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.on("message",
	function(msg, rinfo) {
		var msgStr = msg.toString();
		console.log("from: %s:%d msg: %s [%d]", rinfo.address, rinfo.port, msgStr, Date.now());
		if (msgStr.indexOf("close") !== -1) {
			server.close();
		}
	}
);

server.on("listening",
	function() {
		var endPoint = server.address();
		console.log(endPoint.address + ":" + endPoint.port);
	}
);

server.bind(7119);

