var n2n = require("./n2n");
var dgram = require("dgram");

var testMessage = new Buffer("Hello N2N ~!!");
var client = n2n.createSocket();
client.init();

var nc = n2n.createNotificationCenter();
var ntf = "send message notification";

nc.register(ntf, false,
	function(arg) {
		console.log("time to send message [" + Date.now() +"]" );
		client.send(testMessage, null);
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
		var closeMessage = new Buffer("close");
		client.send(closeMessage, null);
		);
	},
	60000
);
