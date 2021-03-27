# Discord Slim
[![npm](https://img.shields.io/npm/v/discord-slim?style=for-the-badge)](https://www.npmjs.com/package/discord-slim)  

Lightweight **Discord** client for **Node.js**.  

Provides access to Discord client gateway and API for bots.  
Very minimalistic way without excessive abstractions and dependencies. Also with very low resources usage.  

### Note
New version (V2) is under development.  
This version (V1) is now legacy and will be deprecated.  

### Support & suggestions server
https://discord.gg/drsXkP8R4h  

## Before you start
### **Node.js** 12+ is required!
Make sure you have some understaning of **[Discord API](https://discordapp.com/developers/docs)**.  

## API

### `Client` - main client class.  
Methods  
* `Auth(token)` - set up token for the client.  
* `Connect(intents?)` - connect to the gateway to receive intents.  
* `Disconnect()` - disconnect from the gateway.  
* `Request(method, route, data?, auth?)` - send a request to Discord API.  
* `WsSend(data)` - send data to the gateway directly.  

`?` *means optional arg.*

Events  
* `connect` - client established a connection to the gateway.
* `disconnect` - client disconnected.
* `packet` - intent packet received.
* `warn` - other noticeable information.
* `error` - error appeared, client will continue to work.
* `fatal` - fatal error, client will shutdown.

### Other exports
`Host` - contains current Discord domain.  
`API` - contains current Discord API address.  
`CDN` - contains current Discord CDN address.  
`Routes` - base API route constructors.  
`Permissions` - list of known permissions.  
`Intents` - list of known intents.  
`OPCode` - list of the gateway opcodes.  

Other exports from API: `AuditLogEvents`, `ChannelTypes`, `MessageTypes`, `MessageActivityTypes`, `MessageFlags`, `MessageStickerFormatTypes`, `DefaultMessageNotificationLevel`, `ExplicitContentFilterLevel`, `MFA_Level`, `VerificationLevel`, `PremiumTier`, `TargetUserTypes`, `ActivityTypes`.

## Installation
```sh
npm i discord-slim
```

### Basic bot setup example
```js
const Discord = require('discord-slim');

const client = new Discord.Client();

client.Auth('BOT_TOKEN');
client.Connect(Discord.Intents.GUILDS | Discord.Intents.GUILD_MESSAGES);

// Listen for intent packets
client.on('packet', packet => {
    // packet.t contains intent type
    // packet.d contains intent data
    if(packet.t == 'MESSAGE_CREATE')
        HandleMessage(packet.d);
});
```
You can read about possible intents [here](https://discordapp.com/developers/docs/topics/gateway#gateway-intents) and [here](https://discordapp.com/developers/docs/topics/gateway#commands-and-events-gateway-events).  

### Scripting and routing
`Auth` and `Connect` functions are separated because API requests doesn't actually require connection to the gateway. This is useful if you want only a script that just sends some requests without actual client connection.  
```js
const Discord = require('discord-slim');

const client = new Discord.Client();

client.Auth('BOT_TOKEN');
// client.Connect() is not required if you don't need to listen intents

const Routes = Discord.Routes;
// Post a message in some channel
client.Request('POST', Routes.Channel('CHANNEL_ID') + '/messages', { content: 'Hello!' });
```
[Message posting example](https://discordapp.com/developers/docs/resources/channel#create-message)  

## Build from source
Install `typescript` package from `npm` and run `tsc`.  
