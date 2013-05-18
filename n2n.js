"use strict";

var DatagramSocket = require("dgram");

var n2n = (function(dgram) {

	var CNotificationCenter = {
		create: function() {
			var center = {};
			// private fields
			var keys = [];
			var flag = [];
			var vals = [];
			var args = [];

			center.register = function(notification, autoRemove, handler, arg) {
				var index = keys.indexOf(notification);
				if (index < 0) {
					keys.push(notification);
					flag.push(autoRemove);
					vals.push(handler);
					args.push(arg);
				}
				else {
					vals[index] = handler;
					args[index] = arg;
					flag[index] = autoRemove;
				};
				return;
			}; // end of center.register()

			center.post = function(notification) {
				var index = keys.indexOf(notification);
				if (index >= 0) {
					var handler    = vals[index];
					var argument   = args[index];
					var willRemove = flag[index];

					if (willRemove == true) {
						keys.splice(index, 1);
						flag.splice(index, 1);
						vals.splice(index, 1);
						args.splice(index, 1);
					};

					if (typeof handler === "function") {
						return handler(argument);
					};
				};
				console.log("NotificationCenter.post() did nothing.");
			}; // end of center.post()

			return center;
		} // end of CNotificationCenter.create

	} // end of var CNotificationCenter
	;

	/* A FULL DUPLEX asynchronous socket, it autonomously decides which ports
	 * will be used for listening and for sending message individually.
	 *
	*/
	var CSocket = {
		maxStableTime: 4194303, // in ms, 4194303 = 4096*1024 - 1
		minStableTime: 3145728, // 3/4 of max life

		events: ["start", "change", "close", "error", "message"],

		create: function() {
			var socket = {};

			// private fields
			var m_notifCenter = CNotificationCenter.create();
			var m_serverSocket;
			var m_clientSocket;
			var m_userInfo;

			// private methods
			var handleSocketClose = function(arg) {
				console.log(arg.socket.address() + " is closing.");
				arg.socket.close();
			}; // end of handleSocketClose


			var handleSocketExpire = function(arg) {
				var soc = arg.socket;
				var addr = soc.address();
				console.log(addr + " has expired.");

				var socketCloseNotification = "InternalSocketClose" + addr;
				var AUTO_REMOVE = true;

				m_notifCenter.register(
					socketCloseNotification,
					AUTO_REMOVE,
					handleSocketClose,
					arg
				);
				// it is sure here that soc can expire.
				setTimeout(
					function() {
						m_notifCenter.post(socketCloseNotification);
					},
					maxStableTime - minStableTime
				);

				if (soc === m_activeServerSocket) {
					// m_activeServerSocket = null;
				}
			}; // end of handleSocketExpire


			var createDgramSocket = function(port, canExpire) {
				var AUTO_REMOVE = true;
				var soc = dgram.createSocket("udp4");
				var arg = {
					socket: soc,
					expire: canExpire
				};

				soc.bind(port);

				var socketExpireNotification = "InternalSocketExpire" + port;
				m_notifCenter.register(
					socketExpireNotification,
					AUTO_REMOVE,
					handleSocketExpire,
					arg
				);


				if (canExpire === true) {
					setTimeout(
						function() {
							m_notifCenter.post(socketExpireNotification);
						},
						minServerLife
					);
				};
				return soc;
			};


			socket.init = function() {
				m_serverSocket = createDgramSocket(7119, false);
				m_clientSocket = createDgramSocket(5233, false);
			};

			socket.on = function(eventName, handler) {
			};

			socket.send = function(msg, otherNode) {
				m_clientSocket.send(msg, 0, msg.length, 7119, "localhost")
			};

			socket.close = function() {
				m_serverPort.close();
				m_clientPort.close();
			};

			socket.start = function() {
			};

			return socket;
		} // end of CSocket.create()

	} // end of var CSocket
	;


	var CUser = {
		create: function() {
			var user = {};
			return user;
		}
	} // end of class CUser
	;


	var CNode = {

		create: function() {
			var node = {};
			return node;
		}
	} // end of class Node
	;

	return {
		createNotificationCenter: function() { return CNotificationCenter.create(); },
		createSocket: function() { return CSocket.create(); }
	};

})(DatagramSocket); // end of var n2n


module.exports = n2n;
