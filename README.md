# Discord Slim

V2 IS UNDER DEVELOPMENT!  
Contains breaking changes and incompatible with V1.  

Support & suggestions server:  
https://discord.gg/drsXkP8R4h  

# Usage example

```js
const
    Discord = require('discord-slim'),
    Actions = Discord.Actions,
    Events = Discord.Helpers.Events,
    Intents = Discord.Helpers.Intents,
    client = new Discord.Client(),
    authorization = new Discord.Authorization('token'),
    requestOptions = { authorization };

client.events.on(Events.MESSAGE_CREATE, (message) => {
    if(message.author.id == client.user.id) return;
    if(message.content.toLowerCase().indexOf('hello bot') < 0) return;
    Actions.Message.Create(message.channel_id, { content: `Hi, <@${message.author.id}>!` }, requestOptions);
});

client.Connect(authorization, Intents.GUILDS | Intents.GUILD_MESSAGES);
```
