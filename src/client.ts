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
    RESUME = 6,
    RECONNECT = 7,
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

        const gateway = SafeJsonParse(await HttpsRequest(`${API}/gateway/bot`, { headers: { Authorization: this.#auth } }));
        if(!(gateway && (typeof gateway.url == 'string')))
            throw 'Unable to connect: unexpected gateway API response.';

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

        return new Promise<object>((resolve, reject) => {
            const
                url = `${API}${route}`,
                options = {
                    method: method,
                    headers: {
                        Authorization: auth || this.#auth,
                        'Content-Type': contentType,
                        'Content-Length': contentLength,
                    },
                };

            const TryRequest = () => HttpsRequest(url, options, content).then(result => resolve(SafeJsonParse(result) || {})).catch(RequestError);

            let retryCount = 0;

            const Retry = (time = STANDARD_TIMEOUT) => {
                retryCount++;
                this.emit('warn', `Try ${retryCount}/${REQUEST_RETRY_COUNT} was failed.`);

                if(retryCount < REQUEST_RETRY_COUNT)
                    setTimeout(TryRequest, time);
                else
                    reject('Unable to complete operation.');
            };

            const RequestError = (result: { code: number; ext?: string; data?: string | null; } | number | string) => {
                if(!result)
                    return reject('Unexpected request error.');

                if(typeof result != 'object')
                    return reject((result == 1) ? 'Request timeout.' : result);

                if(result.code == 429) {
                    const response = SafeJsonParse(result.data);
                    Retry(response.retry_after);
                    this.emit('warn', `${response.message} Global: ${response.global}`);
                } else if((result.code >= 400) && (result.code < 500)) {
                    const response = SafeJsonParse(result.data);
                    reject(`[API] ${response.message || response.error}`);
                } else {
                    Retry();
                    this.emit('error', `${result.code} ${result.ext}`);
                }
            };

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
}

type ObjectWithId = {
    id: string;
    [key: string]: any;
};

const GetId = (obj: any) => obj.id || obj;

export const Routes = {
    User: (user: string | ObjectWithId) => `/users/${GetId(user)}`,
    Server: (server: string | ObjectWithId) => `/guilds/${GetId(server)}`,
    Channel: (channel: string | ObjectWithId) => `/channels/${GetId(channel)}`,
    Invite: (invite: string) => `/invite/${invite}`,
    Webhook: (webhook: string | ObjectWithId, token: string) => `/webhooks/${GetId(webhook)}/${token}`,
    Member: (server: string | ObjectWithId, member: string | ObjectWithId) => `${Routes.Server(server)}/members/${GetId(member)}`,
    Role: (server: string | ObjectWithId, member: string | ObjectWithId, role: string | ObjectWithId) => `${Routes.Member(server, member)}/roles/${GetId(role)}`,
    Emoji: (server: string | ObjectWithId, emoji: string | ObjectWithId) => `${Routes.Server(server)}/emojis/${GetId(emoji)}`,
    Message: (channel: string | ObjectWithId, message: string | ObjectWithId) => `${Routes.Channel(channel)}/messages/${GetId(message)}`,
    Reaction: (channel: string | ObjectWithId, message: string | ObjectWithId, emoji: string | ObjectWithId) => `${Routes.Message(channel, message)}/reactions/${GetId(emoji)}`,
    Pin: (channel: string | ObjectWithId, message: string | ObjectWithId) => `${Routes.Channel(channel)}/pins/${GetId(message)}`,
    Recipient: (channel: string | ObjectWithId, user: string | ObjectWithId) => `${Routes.Channel(channel)}/recipients/${GetId(user)}`,
    Relationship: (fromUser: string | ObjectWithId, toUser: string | ObjectWithId) => `${Routes.User(fromUser)}/relationships/${GetId(toUser)}`,
    Note: (user: string | ObjectWithId, note: string) => `${Routes.User(user)}/notes/${note}`,
};

export enum Permissions {
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

const HttpsRequest = (url: string | URL, options: https.RequestOptions, data?: string | Buffer) => {
    return new Promise<string | null>((resolve, reject) => {
        const request = https.request(url, options, response => {
            const ReturnResult = (result?: string | null) => (response.statusCode && (response.statusCode >= 200) && (response.statusCode < 300)) ? resolve(result) : reject({ code: response.statusCode || 0, ext: response.statusMessage, data: result });

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

        request.on('error', () => reject('Request error.'));
        request.on('timeout', () => reject(1));

        request.end(data);
    });
};

const SafeJsonParse = (data?: string | null) => {
    try {
        if(data)
            return JSON.parse(data);
    } catch { }
    return null;
};
