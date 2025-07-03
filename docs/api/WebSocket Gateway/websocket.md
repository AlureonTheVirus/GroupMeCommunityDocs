---
title: "Websocket Gateway"
description: "Learn how to interact with GroupMe's WebSocket Gateway via the API."
---

# WebSockets Overview

GroupMe’s real-time messaging is powered by a [Faye-based Bayeux WebSocket protocol](https://faye.jcoglan.com/browser/subscribing.html). Clients subscribe to various channels and receive structured push messages.

WebSocket messages sent downstream to clients are divided into three different channel types, each with their own respective context and message types.

The most useful channel is `/user/:user_id`, which sends messages about new events that any client will send you push notifications about. 
(e.g., new messages in groups you're a part of or reactions attached to messages you have sent).

The other two less important channel types are `/groups/:group_id`, and `/direct_message/:dm_id`. 
Both send information about specific channels that a client wouldn't need to send push notifications for but would need to render the channel when it's open correctly and on the screen. 
(e.g., typing indicators or  membership/role updates for specific users)

***

## Connecting to the Gateway

For verbosity, we outline how to authenticate and connect using a Faye client library, in pure WebSockets (in case you don't have access to a library), and finally in pure HTTP to do manual long-polling.

=== "Option 1: Using a Faye Client (Recommended)"

	**Option 1: Using a Faye Client (Recommended)**

	Faye/Bayeux WebSocket clients exist in many languages ([JavaScript](https://www.npmjs.com/package/faye), [Ruby](https://rubygems.org/gems/faye-websocket/versions/0.10.4?locale=en), [Python](https://github.com/dkmadigan/python-bayeux-client), etc.), and they're the preferred way of hitting GroupMe's Push Gateway. If your language doesn't have a Bayeux client or you really want a challenge you can [implement the protocol manually using raw WebSockets](#option-2-pure-websockets) or [stick to polling for updates via HTTP](#option-3-manual-long-polling-over-http) (Not recommended, but still possible).

	For simplicity, this example will be given in node.js using the [faye](https://www.npmjs.com/package/faye) npm package.

	```bash
	npm install faye
	```

	Start by initiating a connection with GroupMe's Faye server and configuring it to add your API token and a timestamp (in seconds since the Unix epoch) to any outgoing messages:

	```js linenums="1"
	const faye = require('faye');
	const client = new faye.Client("https://push.groupme.com/faye");

	// add your API credentials to outgoing WebSocket messages
	client.addExtension({ 
	  outgoing: (msg, callback) => {
	    msg.ext = msg.ext || {};
	    msg.ext.access_token = "<YOUR GROUPME API ACCESS TOKEN>";
	    msg.ext.timestamp = Math.round(Date.now() / 1000);
	    callback(msg);
	  }
	});
	```

	**Subscribing to Channels**

	In order to actually start receiving messages, you must subscribe to a channel. The main channel you will always want to subscribe to is `/user/:user_id` (where `:user_id` is your GroupMe account's ID) as it is where most general updates will be sent. Any notification that will buzz your phone is sent over this channel. 

	```js linenums="1"
	client.subscribe("/user/:user_id", msg => { 
	  /* Callback to run when an incoming message is received */
	});
	```

	In some circumstances, in order to catch certain events (like typing indicators) you will also need to subscribe to specific message channels. This differs slightly between groups and direct messages, where groups use `/group/:group_id`, and DMs use `/direct_message/:chat_id`. Note that subgroup channels in a group are considered their own channels, so in order to catch their updates you must subscribe to `/groups/:subgroup_id`.

	!!! important
	
		Direct Message channel IDs are reported within the REST API looking something like `74938777+93645911`, two user IDs separated with a `+`. However, for whatever reason, the WebSocket server only accepts DM channel IDs when they are separated using an underscore (e.g. `74938777_93645911`). Make sure to find and replace these symbols before attempting to subscribe to those channels.

=== "Option 2: Pure WebSockets"

	**Option 2: Pure WebSockets**

	If you're not using a Faye client library, you can still connect to GroupMe’s real-time Push Service by directly implementing the Bayeux protocol over WebSockets. This approach is transport-agnostic and works in any language that supports WebSockets and JSON.

	!!! info
	
		For complex steps (like subscription formatting), we’ll show JavaScript snippets to help illustrate what your code might look like.

	**Step 1: Perform the Handshake (via HTTP)**

	Before opening a WebSocket, you must perform an initial handshake via HTTP to receive a `clientId`. This is a one-time HTTP POST request to the Bayeux endpoint.

	Send a JSON array with a channel of `/meta/handshake`, the Bayeux version, and the supported connection types. You must include `"websocket"` in `supportedConnectionTypes`.

	```json linenums="1" title="HTTP Request"
	POST https://push.groupme.com/faye
	[
	  {
	    "channel": "/meta/handshake",
	    "version": "1.0",
	    "supportedConnectionTypes": ["websocket"],
	    "id": "1"
	  }
	]
	```

	GroupMe will respond with a `clientId`, which you'll use for all future messages. The response also includes a list of supported transport types (confirm `"websocket"` is included), and an `advice` object for reconnection behavior.

	**Step 2: Open a WebSocket to the Push Server**

	Once you’ve received a valid `clientId`, initiate a WebSocket connection to:

	```json
	wss://push.groupme.com/faye
	```

	After connecting, begin sending JSON-encoded Bayeux messages directly over the socket.

	**Step 3: Start the `/meta/connect` Loop**

	Immediately after connecting, send a `/meta/connect` message to initiate the message delivery loop. This step essentially "registers" your client as ready to receive pushes.

	```json linenums="1" title="Data"
	{
	  "channel": "/meta/connect",
	  "clientId": "<YOUR CLIENT ID>",
	  "connectionType": "websocket",
	  "id": "2"
	}
	```

	This message must be sent repeatedly after each `/meta/connect` response — think of it as polling, but over a persistent socket.

	In JavaScript, this could look like:

	```js linenums="1"
	const connect = () => {
	  socket.send(JSON.stringify({
	    channel: "/meta/connect",
	    clientId, // <YOUR CLIENT ID>
	    connectionType: "websocket",
	    id: nextMessageId()
	}));
	};
	```

	The server will respond with `successful: true` and may include an `advice` field specifying a `timeout` or `interval` before the next call.

	**Step 4: Subscribe to Channels**

	To receive push notifications, you must subscribe to the appropriate channel(s). Most useful real-time events will come through `/user/:user_id`.

	Subscriptions require authentication: you must include your GroupMe API access token and a Unix timestamp (in seconds) in the `ext` field.

	```json linenums="1" title="Data"
	{
	  "channel": "/meta/subscribe",
	  "clientId": "<YOUR CLIENT ID>",
	  "subscription": "/user/<YOUR GROUPME USER ID>", // alternatively, any other channel you'd like to subscribe to
	  "id": "3",
	  "ext": {
	    "access_token": "<YOUR API TOKEN>",
	    "timestamp": 1715700000
	  }
	}
	```

	In JavaScript, constructing this might look like:

	```js linenums="1"
	const subscribe = (channel) => {
	  socket.send(JSON.stringify({
	    channel: "/meta/subscribe",
	    clientId,
	    subscription: channel,
	    id: nextMessageId(),
	    ext: {
	      access_token: GROUPME_ACCESS_TOKEN, // <YOUR GROUPME API ACCESS TOKEN>
	      timestamp: Math.floor(Date.now() / 1000)
	    }
	  }));
	};

	subscribe(`/user/${GROUPME_USER_ID}`); // <YOUR GROUPME USER ID>
	```

	**Step 5: Listen for Messages**

	All incoming WebSocket messages will be JSON arrays of Bayeux-style messages. Each one will include:

	* A `channel`
	* A `data` payload
	* and potentially some metadata, like `id` or `clientId`

	Example incoming message:

	```json linenums="1" title="Incoming Data"
	{
	  "channel": "/user/185",
	  "data": {
	    "type": "line.create",
	    "subject": { 
	      "name": "Andygv",
	      "avatar_url":null,
	      "location": { "name": null, "lng": null,"foursquare_checkin": false,"foursquare_venue_id": null,"lat": null},
	      "created_at": 1322557919,
	      "picture_url": null,
	      "system": false,
	      "text": "hey",
	      "group_id": "1835",
	      "id": "15717",
	      "user_id": "162",
	      "source_guid": "GUID 13225579210290"
	    },
	    "alert": "Andygv: hey"
	  },
	  "clientId": "1lhg38m0sk6b63080mpc71r9d7q1",
	  "id": "4uso9uuv78tg4l7csica1kc4c",
	  "authenticated": true
	}
	```

	In JS, you'd handle this with something like:

	```js linenums="1"
	socket.onmessage = (event) => {
	  const messages = JSON.parse(event.data);
	  for (const message of messages) {
	    if (message.channel.startsWith("/user/")) {
	      handleUserMessage(message.data);
	    }
	  }
	};
	```

	**Optional: Subscribing to Group or DM Channels**

	You can also subscribe to `/group/:group_id` and `/direct_message/:direct_message_id` channels to get additional channel-specific messages that wouldn't usually buzz your phone, like typing indicators.

	To do this: repeat step 4 as many times as necessary, setting the `subscription` parameter to whatever channel you're interested in.

	!!! important

		Please note that when subscribing to DM channels, you must replace the `+` in the conversation ID (as it appears in the REST API) with an `_` instead. We're not entirely sure why this inconsistency exists, but it does.

=== "Option 3: Manual Long-Polling over HTTP"

	**Option 3: Manual Long-Polling over HTTP (Not Recommended)**

	Start by establishing a connection with GroupMe's Faye server.

	Send a POST request to `https://push.groupme.com/faye`. It should look like this:

	```json linenums="1" title="HTTP Request"
	POST https://push.groupme.com/faye
	[
	  {
	    "channel":"/meta/handshake",
	    "version":"1.0",
	    "supportedConnectionTypes":["long-polling"],
	    "id":"1"
	  }
	]
	```

	The response should look something like:

	```json linenums="1" title="HTTP Response"
	[
	  {
	    "id": "1",
	    "channel": "/meta/handshake",
	    "successful": true,
	    "version": "1.0",
	    "supportedConnectionTypes": ["long-polling","cross-origin-long-polling","callback-polling","websocket","in-process"],
	    "clientId": <IMPORTANT CLIENT ID>,
	    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
	  }
	]
	```

	Note the `clientId` value we've just received, as we will need it in the next step.

	In order to subscribe to channels we need to send another POST request with the following body, inserting the `ClientId` value we got from the last request in step one.

	```json linenums="1" title="HTTP Request"
	POST https://push.groupme.com/faye
	[
	  {
	    "channel": "/meta/subscribe",
	    "clientId": <CLIENT ID>,
	    "subscription": "/user/<YOUR GROUPME USER ID>",
	    "id": "2",
	    "ext": {
	        "access_token": "<YOUR GROUPME API ACCESS TOKEN>",
	        "timestamp": <CURRENT TIMESTAMP>
	    }
	  }
	]
	```

	!!! important

    	1. The `id` parameter should increment with each successive call to the server. Not doing so may lead to undefined behavior.

    	2. The `timestamp` parameter is in seconds since the Unix epoch. Divide whatever timestamp you have by 1000.

	GroupMe's response should look something like this:

	```json linenums="1" title="HTTP Response"
	[
	  {
	    "id": "2",
	    "clientId": <CLIENT ID>,
	    "channel": "/meta/subscribe",
	    "successful": true,
	    "subscription": "/user/<YOUR GROUPME USER ID>"
	  }
	]
	```

	!!! tip

		This step is *usually* overkill. Almost all important real-time updates will come through the `/user/:user_id` channel. You will need to subscribe to individual groups or direct message channels if you want to catch read receipts or certain admin events.

	The POST request for subscribing to a specific channel looks like this (Note that it is basically exactly the same except for a different subscription channel):

	```json linenums="1" title="HTTP Request"
	POST https://push.groupme.com/faye
	[
	  {
	    "channel": "/meta/subscribe",
	    "clientId": <CLIENT ID>,
	    "subscription": "/group/<GROUP ID>" OR "/direct_message/<DIRECT MESSAGE CHANNEL ID>",
	    "id": "2",
	    "ext": {
	      "access_token": "<YOUR GROUPME API ACCESS TOKEN>",
	      "timestamp": <CURRENT TIMESTAMP>
	    }
	  }
	]
	```

	!!! important

  		Direct Message channel IDs are reported within the REST API looking something like `74938777+93645911`, two user IDs separated with a `+`. However, for whatever reason, the WebSocket server only accepts DM channel IDs when they are separated using an underscore (`_`). Make sure to find and replace these symbols before attempting to subscribe to those channels.

	This step is already handled for you by most Faye libraries. However, if you're doing this manually via HTTP and not WebSockets, you will need to manually check for updates from the Faye server.

	```json linenums="1" title="HTTP Request"
	POST https://push.groupme.com/faye
	[
	  {
	    "channel": "/meta/connect",
	    "clientId": <CLIENT ID>,
	    "connectionType": "long-polling",
	    "id": "3"
	  }
	]
	```

	If GroupMe has nothing to report, it will respond with an array of placeholder objects for each of the channels you're subscribed to. That would look something like this:

	```json linenums="1" title="HTTP Response"
	[
	  {
	    "id": "4",
	    "clientId": <CLIENT ID>,
	    "channel": "/meta/connect",
	    "successful": true,
	    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
	  },
	  {
	    "channel": "/user/<YOUR GROUPME USER ID>",
	    "data": {"ping":true},
	    "clientId": <CLIENT ID>,
	    "id": "5",
	    "ext": {
		  "access_token":"<access token>",
		  "timestamp":1322557872
		},
	    "authenticated": true
	  }
	]
	```

	If there is something to report, GroupMe will respond with something that might look like this:

	```json linenums="1" title="HTTP Response"
	[
	  {
	    "id": "5",
	    "clientId": <CLIENT ID>,
	    "channel": "/meta/connect",
	    "successful": true,
	    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
	  },
	  {
	    "channel": "/user/<YOUR GROUPME USER ID>",
	    "data": {
	      "type": "line.create",
	      "subject": {
	        "name":"Andygv",
	        "avatar_url":null,
	        "location": { "name": null, "lng": null,"foursquare_checkin": false,"foursquare_venue_id": null,"lat": null},
	        "created_at": 1322557919,
	        "picture_url": null,
	        "system": false,
	        "text": "hey",
	        "group_id": "1835",
	        "id": "15717",
	        "user_id": "162",
	        "source_guid": "GUID 13225579210290"
	      },
	      "alert": "Andygv: hey"
	    },
	    "clientId": <CLIENT ID>,
	    "id": "4uso9uuv78tg4l7csica1kc4c",
	    "authenticated":true
	  }
	]
	```

***

## Sending WebSocket Messages

After you've subscribed to channels, sending faye messages is relatively straightforward:

```js linenums="1"
const faye = require('faye');
const client = new faye.Client("https://push.groupme.com/faye");

// add your API credentials to outgoing WebSocket messages
client.addExtension({ 
  outgoing: (msg, callback) => {
    msg.ext = msg.ext || {};
    msg.ext.access_token = "<YOUR GROUPME API ACCESS TOKEN>";
    msg.ext.timestamp = Math.round(Date.now() / 1000);
    callback(msg);
 }
});

// subscribe to the '/user/:user_id' channel.
client.subscribe("/user/<YOUR GROUPME USER ID>", msg => { 
  /* Callback to run when a message is received */
});

client.publish("/user/<YOUR GROUPME USER ID>", data); // `data` should be the outgoing message object you're trying to send
```

As far as we're aware, clients are only allowed to send [`ping`](#ping) and [`typing`](#typing) messages. Any other message type will be ignored by the server.

***