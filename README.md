# Discord Slim
### V2 IS UNDER DEVELOPMENT!  
Contains breaking changes and incompatible with V1.  
Dev version is unstable and can have bugs!  
API is unfinished and may be changed with further updates.  

### V2 main features
- Typed actions API instead of manual requests.  
- Typed events API instead of manual packet handling.  
- Actions is now independent from the client.  
- Uses new Discord API version (v8) with slash commands support

### Support & suggestions server
https://discord.gg/drsXkP8R4h  

## Before you start
### **Node.js** 12+ is required!
Make sure you have some understaning of **[Discord API](https://discordapp.com/developers/docs)**.  

## Installation
### Note: NPM version may be out-of-date and not contain latest repo commits.
```
npm i discord-slim@dev
```

## Usage example
### Initial setup
```js
const { Client, Authorization, Events, Actions, Helpers } = require('discord-slim');

// Basic setup to control client operation.
// You probably want to use such code for every bot.
const client = new Client();
client.on('connect', () => console.log('Connection established.'));
client.on('disconnect', (code) => console.error(`Disconnect. (${code})`));
client.on('warn', console.warn);
client.on('error', console.error);
client.on('fatal', (e) => { console.error(e); process.exit(1); });

// Authorization object. Required for client and actions.
const authorization = new Authorization('token');

// Request options for actions
const requestOptions = {
    // Include authorization, it is required for most actions.
    authorization,

    // Rate limit behavior configuration.
    // This options is not required, but you probably want to care about the rate limit.
    rateLimit: {
        // Set how many attempts to make due to the rate limit. Default: 5.
        retryCount: 5,
        // Rate limit hit callback
        callback: (response, attempts) => console.log(`${response.message} Global: ${response.global}. Cooldown: ${response.retry_after} sec. Attempt: ${attempts}.`),
    },
};

...

client.Connect(authorization, Helpers.Intents.GUILDS | Helpers.Intents.GUILD_MESSAGES);
```

### Basic message response
```js
client.events.on(Events.MESSAGE_CREATE, (message) => {
    if(message.author.id == client.user.id) return;
    if(message.content.toLowerCase().indexOf('hello bot') < 0) return;
    Actions.Message.Create(message.channel_id, {
        content: `Hi, <@${message.author.id}>!`,
        message_reference: {
            channel_id: message.channel_id,
            message_id: message.id,
        },
    }, requestOptions);
});
```

### Set bot status
```js
client.events.on(Events.READY, () => {
    client.UpdateStatus({
        since: 0,
        activities: [
            {
                name: 'YOU',
                type: Helpers.ActivityTypes.WATCHING,
            }
        ],
        afk: false,
        status: 'online',
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
    }, requestOptions);
});

// Respond to interaction event.
client.events.on(Events.INTERACTION_CREATE, (interaction) => {
    if(!(interaction.data && interaction.data.name == 'echo')) return;
    Actions.Application.CreateInteractionResponse(interaction.id, interaction.token, {
        type: Helpers.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: interaction.data.options[0].value,
            flags: Helpers.InteractionResponseFlags.EPHEMERAL,
        },
    }, requestOptions);
});
```

## Build from source
Install `typescript` package from `npm` and run `tsc`.  
