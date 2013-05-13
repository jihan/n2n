var n2n = require("./NotificationCenter");
var dgram = require("dgram");

var message = new Buffer("Hello N2N ~!!");
var client = dgram.createSocket("udp4");

var nc = n2n.createNotificationCenter();
var ntf = "send message notification";

nc.register(ntf, false,
	function(arg) {
		console.log("time to send message " + Date.now() );
		client.send(message, 0, message.length, 7119, "localhost");
	},
	{} // empty argument for handler
);

setInterval(
	function() {
		nc.post(ntf);
	},
	2048
);


setTimeout(
	function() {
		client.close();
	},
	60000
);
