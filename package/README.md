# Discord Slim

Lightweight **Discord API** library for **Node.js**.  
Provides pure API interaction via type definitions and some helper tools, without excessive abstractions.  

## Before you start
### **Node.js** 14+ is required!
Make sure you have some understaning of **[Discord API](https://discordapp.com/developers/docs)**.  

## Docs

### Main exports
**Client** - client for connecting to the Discord API gateway.  
**ClientEvents** - set of possible client events.  
**Authorization** - authorization class for client and actions.  
**Events** - set of possible gateway API events.  
**Actions** - access to API requests.  
**Helpers** - objects and constants for API.  
**Tools** - additional tools for convinience.  
**Voice** - client for connecting to voice channels.  
**VoiceEvents** - set of possible voice client events.  
**Types** - type definitions export for TypeScript.  

**TODO.**  
For now use e.g. VS Code for types completion.  

## Installation
```sh
npm i discord-slim
```

## Usage example
### Initial setup
```js
import { Client, ClientEvents, Authorization, Events, Actions, Helpers, Tools } from 'discord-slim';

// Basic setup to control client operation.
// You probably want to use such code for every bot.

const client = new Client();
client.on(ClientEvents.CONNECT, () => console.log('Connection established.'));
client.on(ClientEvents.DISCONNECT, (code) => console.error(`Disconnect. (${code})`));
client.on(ClientEvents.INFO, console.log);
client.on(ClientEvents.WARN, console.warn);
client.on(ClientEvents.ERROR, console.error);
client.on(ClientEvents.FATAL, (e) => { console.error(e); process.exit(1); });

// Authorization object. Required for client and actions.
const authorization = new Authorization('token');

// Request options for actions.
// By design every action can use its own options.
// But for convinience you can set default options globally for all actions.
// Default options can be overridden by passing `requestOptions` argument.

Actions.setDefaultRequestOptions({

    // Include authorization, it is required for most actions.
    authorization,

    // Rate limit behavior configuration.
    // This options is not required, but you probably want to care about the rate limit.
    rateLimit: {

        // Set how many attempts to make due to the rate limit. Default: 5.
        // This includes the first try, so values 1 and below will be treated as "no retries".
        retryCount: 5,

        // Rate limit hit callback.
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

    // Filter out any bot messages.
    if(message.author.bot) return;

    // Check that the message contains "hello" word.
    if(message.content.search(/(^|\s)hello($|\s)/i) < 0) return;

    // Using both reply and mention just for demo.
    Actions.Message.Create(message.channel_id, {
        content: `Hi, ${Tools.Mention.User(message.author)}!`,
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

    client.UpdatePresence({
        status: Helpers.StatusTypes.ONLINE,
        activities: [{ type: Helpers.ActivityTypes.WATCHING, name: 'YOU' }],
        afk: false,
        since: 0,
    });

});
```

### Async capabilities
```js
client.events.on(Events.READY, async (data) => {

    // Log all the global application commands.
    console.log(await Actions.Application.GetGlobalCommands(data.user.id));

});
```

### Using application commands
Note: application commands require `applications.commands` scope. Read details in [docs](https://discord.com/developers/docs/interactions/application-commands#authorizing-your-application).  
```js
client.events.on(Events.GUILD_CREATE, (guild) => {

    // Create a command in your guild(s).
    // This example represents a simple command that just echoing the text back.
    Actions.Application.CreateGuildCommand('bot_id_here', guild.id, {
        type: Helpers.ApplicationCommandTypes.CHAT_INPUT,
        name: 'echo',
        description: 'Test application command.',
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

    // Check that the interaction is an application command
    if(interaction.type != Helpers.InteractionTypes.APPLICATION_COMMAND) return;

    // Check that the command is a chat command
    const data = interaction.data;
    if(data?.type != Helpers.ApplicationCommandTypes.CHAT_INPUT) return;

    // Check the command by name.
    if(data.name != 'echo') return;

    // Check the data type.
    const option = data.options?.[0];
    if(option?.type != Helpers.ApplicationCommandOptionTypes.STRING) return;

    // Make a response.
    Actions.Application.CreateInteractionResponse(interaction.id, interaction.token, {
        type: Helpers.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {

            // Just echoing the content.
            content: option.value,

            // "EPHEMERAL" flag means that the response will be visible only by the caller.
            flags: Helpers.MessageFlags.EPHEMERAL,

        },
    });

});
```
