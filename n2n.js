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
					var handler  = vals[index];
					var argument = args[index];
					var willRemove = flag[index];

					if (willRemove == true) {
						keys.splice(index, 1);
						vals.splice(index, 1);
						args.splice(index, 1);
						flag.splice(index, 1);
					};

					if (typeof handler === 'function') {
						return handler(argument);
					};
				};
			}; // end of center.post()

			return center;
		} // end of CNotificationCenter.create

	} // end of var CNotificationCenter
	;

	var CSocket = {
		maxServerLife: 4194303, // max life time in millisecond for a server, 4194303 = 4096*1024
		minServerLife: 3600000, // 3600 seconds

		create: function() {
			var socket = {};

			// private fields
			var m_notifCenter = CNotificationCenter.create();
			

			// private methods
			var handleSocketClose = function(arg) {
				console.log(arg.socket.address() + " is closing.");
				arg.socket.close();
			};

			var handleSocketExpire = function(arg) {
				console.log(arg.socket.address() + " has expired.");

				if (!m_serverCloseTimer) {
					clearTimeout(m_serverCloseTimer);
				}
				m_serverCloseTimer = setTimeout(handleServerClose, maxServerLife - minServerLife);
			};

			var dgramSocket = function(port) {
				var SOCKET_EXPIRE_NOTIFICATION = "n2n.Socket._willExpire";
				var AUTO_REMOVE = true;
				var soc = dgram.createSocket("udp4");
				var arg = { socket: s };

				soc.port = port;
				soc.bind(port);
				m_notifCenter.register(SOCKET_EXPIRE_NOTIFICATION, AUTO_REMOVE, handleSocketExpire, arg);
				s.timer = setTimeout(
					function() { m_notifCenter.post(SOCKET_EXPIRE_NOTIFICATION); },
					minServerLife
				);
				return s;
			};

			socket.init = function() {
				var serverSocket = dgramSocket(7119);
			};

			socket.on = function(eventName, handler) {
			};

			socket.send = function(byteArray, otherNode, handler) {
			};

			socket.close = function() {
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
		createNotificationCenter: function() { return CNotificationCenter.create(); }
	};

})(DatagramSocket); // end of var n2n


module.exports = n2n;
