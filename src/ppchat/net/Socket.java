package ppchat.net;

import java.util.TreeMap;
import java.net.DatagramSocket;

import ppchat.net.ISocketMessageHandler;
import ppchat.net.ISocketErrorHandler;
import ppchat.net.IPortExpireHandler;
import ppchat.net.ISocketStartedHandler;
import ppchat.net.ISocketCloseHandler;

public class Socket
{
	public ISocketMessageHandler onMessage;
	public ISocketErrorHandler   onError;
	public IPortExpireHandler    onExpire;
	public ISocketStartedHandler onStart;
	public ISocketCloseHandler   onClose;

	private TreeMap<int, DatagramSocket> incomings;
	private TreeMap<int, DatagramSocket> outgoings;

	public Socket() {
		incomings = new TreeMap<int, DatagramSocket>();
		outgoings = new TreeMap<int, DatagramSocket>();
	}

}
