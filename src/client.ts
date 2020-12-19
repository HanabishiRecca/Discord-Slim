import * as WebSocket from 'ws';
import { EventEmitter } from 'events';
import * as https from 'https';
import { URL } from 'url';

export const
    Host = 'https://discord.com',
    API = 'https://discord.com/api',
    CDN = 'https://cdn.discordapp.com';

const
    STANDARD_TIMEOUT = 1000,
    REQUEST_RETRY_COUNT = 5;

export enum OPCode {
    DISPATCH = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    PRESENCE_UPDATE = 3,
    VOICE_STATE_UPDATE = 4,
    RESUME = 6,
    RECONNECT = 7,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    HEARTBEAT_ACK = 11,
}

export class Client extends EventEmitter {
    #token?: string;
    #auth?: string;
    #sessionId?: string;
    #lastSequence = 0;
    #lastHeartbeatAck = false;
    #heartbeatTimer?: NodeJS.Timeout;
    #ws?: WebSocket;
    #intents?: number;

    constructor() {
        super();
    }

    #WsConnect = async (resume?: boolean) => {
        this.#WsDisconnect();

        if(!resume) {
            this.#sessionId = undefined;
            this.#lastSequence = 0;
        }

        const response = await SafePromise(HttpsRequest(`${API}/gateway/bot`, { headers: { Authorization: this.#auth } }));
        if(!response)
            return this.emit('fatal', 'Unable to retrieve a gateway.');

        const gateway = SafeJsonParse(response.data);
        if(!(gateway && (typeof gateway.url == 'string')))
            return this.emit('fatal', 'Unexpected gateway API response.');

        this.#ws = new WebSocket(gateway.url);
        this.#ws.on('message', this.#OnMessage);
        this.#ws.on('close', this.#OnClose);
        this.#ws.on('error', this.#OnError);
    };

    #WsDisconnect = (code = 1012) => {
        if(!this.#ws) return;
        this.emit('disconnect', code);
        this.#ws.removeAllListeners();
        this.#ws.close(code);
        this.#ws = undefined;
    };

    #OnMessage = (data: WebSocket.Data) => {
        if(typeof data != 'string')
            data = data.toString();

        const packet: { op: number; s?: number; t?: string; d?: any; } = SafeJsonParse(data);
        if(!packet) return;

        if(packet.s && (packet.s > this.#lastSequence))
            this.#lastSequence = packet.s;

        const op = packet.op;
        if(op == OPCode.DISPATCH) {
            const t = packet.t;
            if((t == 'READY') || (t == 'RESUMED')) {
                if(packet.d.session_id)
                    this.#sessionId = packet.d.session_id;

                this.#lastHeartbeatAck = true;
                this.#SendHeartbeat();
                this.emit('connect');
            }
            this.emit('packet', packet);
        } else if(op == OPCode.HELLO) {
            this.#Identify();
            this.#lastHeartbeatAck = true;
            this.#SetHeartbeatTimer(packet.d.heartbeat_interval);
        } else if(op == OPCode.HEARTBEAT_ACK) {
            this.#lastHeartbeatAck = true;
        } else if(op == OPCode.HEARTBEAT) {
            this.#SendHeartbeat();
        } else if(op == OPCode.INVALID_SESSION) {
            this.emit('warn', `Invalid session. Resumable: ${packet.d}`);
            this.#WsConnect(packet.d);
        } else if(op == OPCode.RECONNECT) {
            this.emit('warn', 'Server forced reconnect.');
            this.#WsConnect(true);
        }
    };

    #Identify = () => {
        this.#ws && this.#ws.send(JSON.stringify(this.#sessionId ?
            {
                op: OPCode.RESUME,
                d: {
                    token: this.#token,
                    session_id: this.#sessionId,
                    seq: this.#lastSequence,
                },
            } :
            {
                op: OPCode.IDENTIFY,
                d: {
                    token: this.#token,
                    properties: { $os: 'linux', $browser: 'bot', $device: 'bot' },
                    version: 6,
                    intents: this.#intents,
                },
            }
        ));
    };

    #SendHeartbeat = () => {
        if(this.#lastHeartbeatAck) {
            if(this.#ws && (this.#ws.readyState == 1)) {
                this.#lastHeartbeatAck = false;
                this.#ws.send(JSON.stringify({ op: OPCode.HEARTBEAT, d: this.#lastSequence }));
            }
        } else {
            this.emit('warn', 'Heartbeat timeout.');
            this.#WsConnect(true);
        }
    };

    #SetHeartbeatTimer = (interval: number) => {
        if(this.#heartbeatTimer) {
            clearInterval(this.#heartbeatTimer);
            this.#heartbeatTimer = undefined;
        }
        if(interval)
            this.#heartbeatTimer = setInterval(this.#SendHeartbeat, interval);
    };

    #OnClose = (code: number) => {
        this.#WsDisconnect(code);
        this.#WsConnect(true);
    };

    #OnError = (error: Error) => this.emit('error', error);

    Auth(token: string) {
        if(!token)
            throw 'Token required.';

        if(typeof token != 'string')
            throw 'Token must be a string.';

        this.#token = token;
        this.#auth = `Bot ${token}`;
    }

    Connect(intents?: Intents) {
        if((intents != null) && !Number.isInteger(intents))
            throw 'Intents must be an integer.';

        this.#intents = intents;
        if(this.#token)
            this.#WsConnect();
        else
            throw 'Authorization required.';
    }

    Disconnect(code?: number) {
        this.#WsDisconnect(code);
    }

    Request(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', route: string, data?: object | string | null, auth?: string) {
        if(method == null)
            throw 'Method required.';

        if(typeof method != 'string')
            throw 'Method must be a string.';

        if(route == null)
            throw 'Route required.';

        if(typeof route != 'string')
            throw 'Route must be a string.';

        const url = `${API}${route}`;

        if((auth != null) && (typeof auth != 'string'))
            throw 'Auth must be a string.';

        let content: string,
            contentType = 'application/x-www-form-urlencoded',
            contentLength = 0;

        if(data) {
            if(typeof data == 'object') {
                content = JSON.stringify(data);
                contentType = 'application/json';
            } else if(typeof data == 'string') {
                content = data;
            } else {
                throw 'Data must be an object or a string.';
            }
            contentLength = Buffer.byteLength(content);
        }

        const options: https.RequestOptions = {
            method: method,
            headers: {
                'Authorization': auth || this.#auth || '',
                'Content-Type': contentType,
                'Content-Length': contentLength,
            },
        };

        return new Promise<any>((resolve, reject) => {
            let retryCount = 0;

            const RequestResult = (result: RequestResult) => {
                const code = result.code;
                if((code >= 200) && (code < 300)) {
                    resolve(SafeJsonParse(result.data));
                } else if((code >= 400) && (code < 500)) {
                    const response = SafeJsonParse(result.data);
                    if(code == 429) {
                        retryCount++;
                        this.emit('warn', `${response.message} Global: ${response.global}`);
                        this.emit('warn', `Try ${retryCount}/${REQUEST_RETRY_COUNT} was failed.`);
                        if(retryCount < REQUEST_RETRY_COUNT)
                            setTimeout(TryRequest, response.retry_after || STANDARD_TIMEOUT);
                        else
                            RequestError({ code: 429, message: 'Unable to complete operation because of rate limit.' });
                    } else {
                        RequestError({ code, message: response.message || response.error || '' });
                    }
                } else {
                    RequestError({ code, message: `Unknown request error.` });
                }
            };

            const RequestError = (error: RequestError) => reject(error);

            const TryRequest = () => HttpsRequest(url, options, content).then(RequestResult).catch(RequestError);

            TryRequest();
        });
    }

    WsSend(packet: { op: OPCode; d: any; }) {
        if(this.#ws)
            this.#ws.send((packet && (typeof packet == 'object')) ? JSON.stringify(packet) : packet);
        else
            throw 'Unable to send packet: no connection.';
    }
}

export interface Client {
    on(event: 'connect', listener: (this: this) => void): this;
    on(event: 'disconnect', listener: (this: this, code: number) => void): this;
    on(event: 'packet', listener: (this: this, packet: { op: number; s: number; t: string; d: any; }) => void): this;
    on(event: 'warn', listener: (this: this, message: string) => void): this;
    on(event: 'error', listener: (this: this, message: string) => void): this;
    on(event: 'fatal', listener: (this: this, message: string) => void): this;

    addListener(event: 'connect', listener: (this: this) => void): this;
    addListener(event: 'disconnect', listener: (this: this, code: number) => void): this;
    addListener(event: 'packet', listener: (this: this, packet: { op: number; s: number; t: string; d: any; }) => void): this;
    addListener(event: 'warn', listener: (this: this, message: string) => void): this;
    addListener(event: 'error', listener: (this: this, message: string) => void): this;
    addListener(event: 'fatal', listener: (this: this, message: string) => void): this;

    off(event: 'connect', listener: (this: this) => void): this;
    off(event: 'disconnect', listener: (this: this, code: number) => void): this;
    off(event: 'packet', listener: (this: this, packet: { op: number; s: number; t: string; d: any; }) => void): this;
    off(event: 'warn', listener: (this: this, message: string) => void): this;
    off(event: 'error', listener: (this: this, message: string) => void): this;
    off(event: 'fatal', listener: (this: this, message: string) => void): this;

    removeListener(event: 'connect', listener: (this: this) => void): this;
    removeListener(event: 'disconnect', listener: (this: this, code: number) => void): this;
    removeListener(event: 'packet', listener: (this: this, packet: { op: number; s: number; t: string; d: any; }) => void): this;
    removeListener(event: 'warn', listener: (this: this, message: string) => void): this;
    removeListener(event: 'error', listener: (this: this, message: string) => void): this;
    removeListener(event: 'fatal', listener: (this: this, message: string) => void): this;

    once(event: 'connect', listener: (this: this) => void): this;
    once(event: 'disconnect', listener: (this: this, code: number) => void): this;
    once(event: 'packet', listener: (this: this, packet: { op: number; s: number; t: string; d: any; }) => void): this;
    once(event: 'warn', listener: (this: this, message: string) => void): this;
    once(event: 'error', listener: (this: this, message: string) => void): this;
    once(event: 'fatal', listener: (this: this, message: string) => void): this;

    removeAllListeners(): this;
    removeAllListeners(event: 'connect' | 'disconnect' | 'packet' | 'warn' | 'error' | 'fatal'): this;
}

export type RequestError = {
    code: number;
    message: string;
};

const GetId = (obj: any) => obj.id || obj;

export const Routes = {
    User: (user: string | { id: string; }) => `/users/${GetId(user)}`,
    Server: (server: string | { id: string; }) => `/guilds/${GetId(server)}`,
    Channel: (channel: string | { id: string; }) => `/channels/${GetId(channel)}`,
    Invite: (invite: string) => `/invite/${invite}`,
    Webhook: (webhook: string | { id: string; }, token: string) => `/webhooks/${GetId(webhook)}/${token}`,
    Member: (server: string | { id: string; }, member: string | { id: string; }) => `${Routes.Server(server)}/members/${GetId(member)}`,
    Role: (server: string | { id: string; }, member: string | { id: string; }, role: string | { id: string; }) => `${Routes.Member(server, member)}/roles/${GetId(role)}`,
    Emoji: (server: string | { id: string; }, emoji: string | { id: string; }) => `${Routes.Server(server)}/emojis/${GetId(emoji)}`,
    Message: (channel: string | { id: string; }, message: string | { id: string; }) => `${Routes.Channel(channel)}/messages/${GetId(message)}`,
    Reaction: (channel: string | { id: string; }, message: string | { id: string; }, emoji: string | { id: string; }) => `${Routes.Message(channel, message)}/reactions/${GetId(emoji)}`,
    Pin: (channel: string | { id: string; }, message: string | { id: string; }) => `${Routes.Channel(channel)}/pins/${GetId(message)}`,
    Recipient: (channel: string | { id: string; }, user: string | { id: string; }) => `${Routes.Channel(channel)}/recipients/${GetId(user)}`,
    Relationship: (fromUser: string | { id: string; }, toUser: string | { id: string; }) => `${Routes.User(fromUser)}/relationships/${GetId(toUser)}`,
    Note: (user: string | { id: string; }, note: string) => `${Routes.User(user)}/notes/${note}`,
    Application: (application: string | { id: string; }) => `/applications/${GetId(application)}`,
    Command: (command: string | { id: string; }) => `/commands/${GetId(command)}`,
    ApplicationCommand: (application: string | { id: string; }, command: string | { id: string; }) => Routes.Application(application) + Routes.Command(command),
    ApplicationServerCommand: (application: string | { id: string; }, server: string | { id: string; }, command: string | { id: string; }) => Routes.Application(application) + Routes.Server(server) + Routes.Command(command),
    Interaction: (interaction: string | { id: string; }, token: string) => `/interactions/${GetId(interaction)}/${token}`,
};

export enum Permissions {
    NO_PERMISSIONS = 0,
    CREATE_INSTANT_INVITE = (1 << 0),
    KICK_MEMBERS = (1 << 1),
    BAN_MEMBERS = (1 << 2),
    ADMINISTRATOR = (1 << 3),
    MANAGE_CHANNELS = (1 << 4),
    MANAGE_GUILD = (1 << 5),
    ADD_REACTIONS = (1 << 6),
    VIEW_AUDIT_LOG = (1 << 7),
    PRIORITY_SPEAKER = (1 << 8),
    STREAM = (1 << 9),
    VIEW_CHANNEL = (1 << 10),
    SEND_MESSAGES = (1 << 11),
    SEND_TTS_MESSAGES = (1 << 12),
    MANAGE_MESSAGES = (1 << 13),
    EMBED_LINKS = (1 << 14),
    ATTACH_FILES = (1 << 15),
    READ_MESSAGE_HISTORY = (1 << 16),
    MENTION_EVERYONE = (1 << 17),
    USE_EXTERNAL_EMOJIS = (1 << 18),
    VIEW_GUILD_INSIGHTS = (1 << 19),
    CONNECT = (1 << 20),
    SPEAK = (1 << 21),
    MUTE_MEMBERS = (1 << 22),
    DEAFEN_MEMBERS = (1 << 23),
    MOVE_MEMBERS = (1 << 24),
    USE_VAD = (1 << 25),
    CHANGE_NICKNAME = (1 << 26),
    MANAGE_NICKNAMES = (1 << 27),
    MANAGE_ROLES = (1 << 28),
    MANAGE_WEBHOOKS = (1 << 29),
    MANAGE_EMOJIS = (1 << 30),
};

export enum Intents {
    SYSTEM_ONLY = 0,
    GUILDS = (1 << 0),
    GUILD_MEMBERS = (1 << 1),
    GUILD_BANS = (1 << 2),
    GUILD_EMOJIS = (1 << 3),
    GUILD_INTEGRATIONS = (1 << 4),
    GUILD_WEBHOOKS = (1 << 5),
    GUILD_INVITES = (1 << 6),
    GUILD_VOICE_STATES = (1 << 7),
    GUILD_PRESENCES = (1 << 8),
    GUILD_MESSAGES = (1 << 9),
    GUILD_MESSAGE_REACTIONS = (1 << 10),
    GUILD_MESSAGE_TYPING = (1 << 11),
    DIRECT_MESSAGES = (1 << 12),
    DIRECT_MESSAGE_REACTIONS = (1 << 13),
    DIRECT_MESSAGE_TYPING = (1 << 14),
};

export enum AuditLogEvents {
    GUILD_UPDATE = 1,
    CHANNEL_CREATE = 10,
    CHANNEL_UPDATE = 11,
    CHANNEL_DELETE = 12,
    CHANNEL_OVERWRITE_CREATE = 13,
    CHANNEL_OVERWRITE_UPDATE = 14,
    CHANNEL_OVERWRITE_DELETE = 15,
    MEMBER_KICK = 20,
    MEMBER_PRUNE = 21,
    MEMBER_BAN_ADD = 22,
    MEMBER_BAN_REMOVE = 23,
    MEMBER_UPDATE = 24,
    MEMBER_ROLE_UPDATE = 25,
    MEMBER_MOVE = 26,
    MEMBER_DISCONNECT = 27,
    BOT_ADD = 28,
    ROLE_CREATE = 30,
    ROLE_UPDATE = 31,
    ROLE_DELETE = 32,
    INVITE_CREATE = 40,
    INVITE_UPDATE = 41,
    INVITE_DELETE = 42,
    WEBHOOK_CREATE = 50,
    WEBHOOK_UPDATE = 51,
    WEBHOOK_DELETE = 52,
    EMOJI_CREATE = 60,
    EMOJI_UPDATE = 61,
    EMOJI_DELETE = 62,
    MESSAGE_DELETE = 72,
    MESSAGE_BULK_DELETE = 73,
    MESSAGE_PIN = 74,
    MESSAGE_UNPIN = 75,
    INTEGRATION_CREATE = 80,
    INTEGRATION_UPDATE = 81,
    INTEGRATION_DELETE = 82,
}

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6,
}

export enum MessageTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    REPLY = 19,
    APPLICATION_COMMAND = 20,
}

export enum MessageActivityTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    REPLY = 19,
    APPLICATION_COMMAND = 20,
}

export enum MessageFlags {
    NO_FLAGS = 0,
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
}

export enum MessageStickerFormatTypes {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
}

export enum DefaultMessageNotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

export enum MFA_Level {
    NONE = 0,
    ELEVATED = 1,
}

export enum VerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

export enum PremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

export enum TargetUserTypes {
    STREAM = 1,
}

type RequestResult = {
    code: number;
    data?: string;
};

const HttpsRequest = (url: string | URL, options: https.RequestOptions, data?: string | Buffer) => {
    return new Promise<RequestResult>((resolve, reject) => {
        const request = https.request(url, options, response => {
            if(response.statusCode == null)
                return reject('Unknown response.');

            const ReturnResult = (result?: string) => resolve({ code: response.statusCode || 0, data: result });

            const chunks: Buffer[] = [];
            let responseLen = 0;

            response.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
                responseLen += chunk.length;
            });

            response.on('end', () => {
                if(!response.complete)
                    return reject('Response error.');

                if(responseLen == 0)
                    return ReturnResult();

                if(chunks.length == 1)
                    return ReturnResult(chunks[0].toString());

                const data = Buffer.allocUnsafe(responseLen);
                let len = 0;
                for(let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    chunk.copy(data, len);
                    len += chunk.length;
                }

                return ReturnResult(data.toString());
            });
        });

        request.on('error', reject);
        request.on('timeout', () => reject('Request timeout.'));

        request.end(data);
    });
};

const SafeJsonParse = (data?: string) => {
    if(data == null)
        return data;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

const SafePromise = (promise: Promise<any>) => new Promise<any>(resolve => promise.then(result => resolve(result)).catch(() => resolve(null)));
