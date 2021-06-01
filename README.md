# Discord Slim
[![npm](https://img.shields.io/npm/v/discord-slim?style=for-the-badge)](https://www.npmjs.com/package/discord-slim)  

Lightweight **Discord API** library for **Node.js**.  
Provides pure interaction with the API with type definitions and some helper tools, without excessive abstractions.  

## Before you start
### **Node.js** 14+ is required!
Make sure you have some understaning of **[Discord API](https://discordapp.com/developers/docs)**.  

## Docs
**TODO.**  
For now use e.g. VS Code for types completion.  

## Installation
```sh
npm i discord-slim
```

## Usage example
### Initial setup
```js
const { Client, ClientEvents, Authorization, Events, Actions, Helpers, Tools } = require('discord-slim');

// Basic setup to control client operation.
// You probably want to use such code for every bot.
const client = new Client();
client.on(ClientEvents.CONNECT, () => console.log('Connection established.'));
client.on(ClientEvents.DISCONNECT, (code) => console.error(`Disconnect. (${code})`));
client.on(ClientEvents.WARN, console.warn);
client.on(ClientEvents.ERROR, console.error);
client.on(ClientEvents.FATAL, (e) => { console.error(e); process.exit(1); });

// Authorization object. Required for client and actions.
const authorization = new Authorization('token');

// Request options for actions.
// By design every action can use it's own options. But for convinience you сan set default options globally for all actions.
// Default options can be overridden in any time by passing `requestOptions` argument to individual action.
Actions.setDefaultRequestOptions({
    // Include authorization, it is required for most actions.
    authorization,

    // Rate limit behavior configuration.
    // This options is not required, but you probably want to care about the rate limit.
    rateLimit: {
        // Set how many attempts to make due to the rate limit. Default: 5.
        // This includes the first try, so values 1 and below will be treated as "no retries".
        retryCount: 5,
        // Rate limit hit callback
        callback: (response, attempts) =>
            console.log(`${response.message} Global: ${response.global}. Cooldown: ${response.retry_after} sec. Attempt: ${attempts}.`),
    },
});

...

// Start the client connection.
client.Connect(authorization, Helpers.Intents.GUILDS | Helpers.Intents.GUILD_MESSAGES);
```
You can read about intents [here](https://discordapp.com/developers/docs/topics/gateway#gateway-intents).  

### Basic message response
```js
client.events.on(Events.MESSAGE_CREATE, (message) => {
    // Filter out own messages
    if(message.author.id == client.user.id) return;
    // Check that the message contains phrases like "hello bot" or "hi bot"
    if(message.content.search(/(^|\s)h(ello|i)(\s|\s.*\s)bot($|\s)/i) < 0) return;
    // Using both reply and mention just for demo
    Actions.Message.Create(message.channel_id, {
        content: `Hi, ${Tools.Mentions.User(message.author.id)}!`,
        message_reference: {
            channel_id: message.channel_id,
            message_id: message.id,
        },
    });
});
```

### Set bot status
```js
client.events.on(Events.READY, () => {
    client.UpdateStatus({
        status: Helpers.StatusTypes.ONLINE,
        activities: [{ type: Helpers.ActivityTypes.WATCHING, name: 'YOU' }],
        afk: false,
        since: 0,
    });
});
```

### Using slash commands
Note: slash commands requires `applications.commands` scope. Read details in [docs](https://discord.com/developers/docs/interactions/slash-commands).  
```js
// Create a command in your guild(s).
client.events.on(Events.GUILD_CREATE, (guild) => {
    Actions.Application.CreateGuildCommand(client.user.id, guild.id, {
        name: 'echo',
        description: 'Test slash command.',
        options: [
            {
                type: Helpers.ApplicationCommandOptionTypes.STRING,
                name: 'text',
                description: 'Echo message text.',
                required: true,
            },
        ],
    });
});

// Respond to interaction event.
client.events.on(Events.INTERACTION_CREATE, (interaction) => {
    if(interaction.data?.name != 'echo') return;
    Actions.Application.CreateInteractionResponse(interaction.id, interaction.token, {
        type: Helpers.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: interaction.data.options[0].value.toString(),
            flags: Helpers.InteractionResponseFlags.EPHEMERAL,
        },
    });
});
```

## Build from source
Install `typescript` package from `npm` and run `tsc`.  
