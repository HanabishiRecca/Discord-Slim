'use strict';

const
    WebSocket = require('ws'),
    Util = require('./util.js');

const
    WEB = 'https://discordapp.com',
    API = `${WEB}/api/v7`,
    CDN = 'https://cdn.discordapp.com',
    STANDARD_TIMEOUT = 1000,
    REQUEST_RETRY_COUNT = 5;

exports.WebHost = WEB;
exports.ApiHost = API;
exports.CdnHost = CDN;

const OPCode = {
    DISPATCH: 0,
    HEARTBEAT: 1,
    IDENTIFY: 2,
    RESUME: 6,
    RECONNECT: 7,
    INVALID_SESSION: 9,
    HELLO: 10,
    HEARTBEAT_ACK: 11,
};

class Client extends require('events') {
    #token;
    #auth;
    #sessionId;
    #lastSequence;
    #lastHeartbeatAck;
    #heartbeatTimer;
    #ws;
    
    constructor() {
        super();
    }
    
    #WsConnect = async resume => {
        this.#ws && this.#ws.close(1001);
        
        if(!resume) {
            this.#sessionId = undefined;
            this.#lastSequence = 0;
        }
        
        this.#ws = new WebSocket(JSON.parse(await Util.HttpsRequest(`${API}/gateway/bot`, { headers: this.#auth })).url);
        this.#ws.on('open', this.#OnOpen);
        this.#ws.on('close', this.#OnClose);
        this.#ws.on('error', this.#OnError);
    }
    
    #OnOpen = () => this.#ws.on('message', this.#OnMessage);
    
    #OnMessage = data => {
        const packet = JSON.parse(data);
        if(!packet)
            return;
        
        if(packet.s > this.#lastSequence)
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
            this.emit('warn', 'Invalid session.');
            this.#WsConnect(packet.d);
        } else if(op == OPCode.RECONNECT) {
            this.emit('warn', 'Server forced reconnect.');
            this.#WsConnect(true);
        }
    }
    
    #Identify = () => {
        this.#ws.send(JSON.stringify(this.#sessionId ? {
            op: OPCode.RESUME,
            d: {
                token: this.#token,
                session_id: this.#sessionId,
                seq: this.#lastSequence,
            },
        } : {
            op: OPCode.IDENTIFY,
            d: {
                token: this.#token,
                properties: { $os: 'linux', $browser: 'bot', $device: 'bot' },
                version: 6,
            },
        }));
    }
    
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
    }
    
    #SetHeartbeatTimer = interval => {
        if(this.#heartbeatTimer) {
            clearInterval(this.#heartbeatTimer);
            this.#heartbeatTimer = undefined;
        }
        if(interval)
            this.#heartbeatTimer = setInterval(this.#SendHeartbeat, interval);
    }
    
    #OnClose = code => {
        this.emit('disconnect', code);
        if(code != 1001)
            this.#WsConnect(true);
    }
    
    #OnError = error => this.emit('error', error);
    
    Connect = token => {
        if(!token)
            throw 'Token required.';
        
        if(typeof(token) == 'string') {
            this.#token = token;
            this.#auth = { Authorization: `Bot ${token}` };
            this.#WsConnect();
        } else {
            throw 'Token must be a string.';
        }
    }
    
    Request = (method, route, data = null) => {
        if(!method)
            throw 'Method required.';
        
        if(typeof(method) != 'string')
            throw 'Method must be a string.';
        
        if(!route)
            throw 'Route required.';
        
        if(typeof(route) != 'string')
            throw 'Route must be a string.';
        
        return new Promise((resolve, reject) => {
            const
                url = `${API}/${route}`,
                options = { method: method, headers: this.#auth },
                comp = (data && (typeof(data) == 'object')) ? JSON.stringify(data) : data;
            
            let retryCount = 0;
            
            const RequestError = result => {
                if(!result)
                    return reject('Unexpected request error');
                
                if(typeof(result) != 'object') {
                    if(result == 1) {
                        Retry();
                        this.emit('error', 'Request timeout.');
                    } else {
                        reject(result);
                    }
                    return;
                }
                
                let response = result.data;
                try { response = JSON.parse(result.data).message; } catch {}
                
                if(result.code == 429) {
                    Retry(response.retry_after + 100);
                    this.emit('error', 'Rate limit reached.');
                } else if((result.code >= 400) && (result.code < 500)) {
                    reject(`[API] ${response}`);
                } else {
                    Retry();
                    this.emit('error', `${result.code} ${result.ext}`);
                }
            };
            
            const TryRequest = () => Util.HttpsRequest(url, options, comp).then(result => resolve(JSON.parse(result))).catch(RequestError);
            
            const Retry = time => {
                retryCount++;
                this.emit('warn', `Try ${retryCount}/${REQUEST_RETRY_COUNT} was failed.`);
                
                if(retryCount < REQUEST_RETRY_COUNT)
                    setTimeout(TryRequest, time || STANDARD_TIMEOUT);
                else
                    reject('Unable to complete operation.');
            };
            
            TryRequest();
        });
    }
    
    WsSend = data => this.#ws && this.#ws.send((data && (typeof(data) == 'object')) ? JSON.stringify(data) : data);
}

exports.Client = Client;

const GetId = obj => obj.id || obj;

const Routes = {
    User: user => `/users/${GetId(user)}`,
    Server: server => `/guilds/${GetId(server)}`,
    Channel: channel => `/channels/${GetId(channel)}`,
    Invite: invite => `/invite/${invite}`,
    Webhook: (webhook, token) => `/webhooks/${webhook}/${token}`,
    Member: (server, member) => `${Routes.Server(server)}/members/${GetId(member)}`,
    Role: (server, member, role) => `${Routes.Member(server, member)}/roles/${role}`,
    Emoji: (server, emoji) => `${Routes.Server(server)}/emojis/${emoji}`,
    Message: (channel, message) => `${Routes.Channel(channel)}/messages/${GetId(message)}`,
    Reaction: (channel, message, emoji) => `${Routes.Message(channel, message)}/reactions/${emoji}`,
    Pin: (channel, message) => `${Routes.Channel(channel)}/pins/${GetId(message)}`,
    Recipient: (channel, user) => `${Routes.Channel(channel)}/recipients/${GetId(user)}`,
    Relationship: (fromUser, toUser) => `${Routes.User(fromUser)}/relationships/${GetId(toUser)}`,
    Note: (user, note) => `${Routes.User(user)}/notes/${note}`,
};

exports.Routes = Routes;

const Permissions = {
    CREATE_INSTANT_INVITE: 0x1,
    KICK_MEMBERS: 0x2,
    BAN_MEMBERS: 0x4,
    ADMINISTRATOR: 0x8,
    MANAGE_CHANNELS: 0x10,
    MANAGE_GUILD: 0x20,
    ADD_REACTIONS: 0x40,
    VIEW_AUDIT_LOG: 0x80,
    PRIORITY_SPEAKER: 0x100,
    STREAM: 0x200,
    VIEW_CHANNEL: 0x400,
    SEND_MESSAGES: 0x800,
    SEND_TTS_MESSAGES: 0x1000,
    MANAGE_MESSAGES: 0x2000,
    EMBED_LINKS: 0x4000,
    ATTACH_FILES: 0x8000,
    READ_MESSAGE_HISTORY: 0x10000,
    MENTION_EVERYONE: 0x20000,
    USE_EXTERNAL_EMOJIS: 0x40000,
    CONNECT: 0x100000,
    SPEAK: 0x200000,
    MUTE_MEMBERS: 0x400000,
    DEAFEN_MEMBERS: 0x800000,
    MOVE_MEMBERS: 0x1000000,
    USE_VAD: 0x2000000,
    CHANGE_NICKNAME: 0x4000000,
    MANAGE_NICKNAMES: 0x8000000,
    MANAGE_ROLES: 0x10000000,
    MANAGE_WEBHOOKS: 0x20000000,
    MANAGE_EMOJIS: 0x40000000,
};

exports.Permissions = Permissions;
