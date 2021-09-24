import WebSocket from 'ws';
import { EventEmitter } from 'events';
import * as helpers from './helpers';
import * as util from './util';
import * as request from './request';
import type * as events from './events';
import type * as types from './types';

const enum OPCode {
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

const enum Events {
    READY = 'READY',
    RESUMED = 'RESUMED',
}

type Intent = {
    op: (
        | OPCode.DISPATCH
        | OPCode.HELLO
        | OPCode.HEARTBEAT_ACK
        | OPCode.HEARTBEAT
        | OPCode.INVALID_SESSION
        | OPCode.RECONNECT
    );
    t: any;
    s: any;
    d: any;
};

const
    fatalCodes = [4004, 4010, 4011, 4012, 4013, 4014],
    dropCodes = [4007, 4009];

export class Client extends EventEmitter {
    private _sessionId?: string;
    private _lastSequence = 0;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timeout;
    private _ws?: WebSocket;
    private _auth?: { authorization: request.Authorization; };
    private _intents?: helpers.Intents;
    private _eventHandler = new EventEmitter() as events.EventHandler;
    private _user?: types.User;
    private _shard?: [number, number];
    private _props?: object | null = { $os: 'linux', $browser: 'bot', $device: 'bot' };

    constructor() {
        super();
    }

    private _wsConnect = async (resume?: boolean) => {
        this._wsDisconnect();

        if(!resume) {
            this._sessionId = undefined;
            this._lastSequence = 0;
            await util.Sleep(5000);
        }

        const response = await request.Request('GET',
            this._auth?.authorization.type == helpers.TokenTypes.BOT ?
                '/gateway/bot' :
                '/gateway',
            this._auth
        ).catch(() => {});

        if(this._ws)
            return this.emit(ClientEvents.WARN, 'Client already connected.');

        if(!response)
            return this.emit(ClientEvents.FATAL, 'Unable to retrieve a gateway.');

        if(typeof response.url != 'string')
            return this.emit(ClientEvents.FATAL, 'Unexpected gateway API response.');

        try {
            this._ws = new WebSocket(`${response.url}?v=${helpers.API_VERSION}`);
        } catch {
            return this.emit(ClientEvents.FATAL, 'Unable to create a socket.');
        }

        this._ws.on('message', this._onMessage);
        this._ws.on('close', this._onClose);
        this._ws.on('error', this._onError);
    };

    private _wsDisconnect = (code = 1012) => {
        if(!this._ws) return;
        this.emit(ClientEvents.DISCONNECT, code);
        this._setHeartbeatTimer();
        this._ws.removeAllListeners();
        this._ws.close(code);
        this._ws = undefined;
    };

    private _send = (op: OPCode, d: any) =>
        this._ws && this._ws.send(JSON.stringify({ op, d }));

    private _dispatchHandlers = {
        [Events.READY]: (d: { session_id: string; user: types.User; }) => {
            const { user, session_id } = d;
            this._user = user;
            this._sessionId = session_id;
            this.emit(ClientEvents.CONNECT);
        },

        [Events.RESUMED]: () =>
            this.emit(ClientEvents.CONNECT),
    };

    private _intentHandlers = {
        [OPCode.DISPATCH]: (intent: { t: Events; s?: number; d: any; }) => {
            const { t, s, d } = intent;

            if(s && (s > this._lastSequence))
                this._lastSequence = s;

            this._dispatchHandlers[t]?.(d);
            this.emit(ClientEvents.INTENT, intent);
            this._eventHandler.emit(t, d);
        },

        [OPCode.HELLO]: (intent: { d: { heartbeat_interval: number; }; }) => {
            this._identify();
            this._lastHeartbeatAck = true;
            this._setHeartbeatTimer(intent.d.heartbeat_interval);
            this._sendHeartbeat();
        },

        [OPCode.HEARTBEAT_ACK]: () =>
            this._lastHeartbeatAck = true,

        [OPCode.HEARTBEAT]: () =>
            this._sendHeartbeat(),

        [OPCode.INVALID_SESSION]: (intent: { d: boolean; }) => {
            const { d } = intent;
            this.emit(ClientEvents.WARN, `Invalid session. Resumable: ${d}`);
            this._wsConnect(d);
        },

        [OPCode.RECONNECT]: () => {
            this.emit(ClientEvents.WARN, 'Server forced reconnect.');
            this._wsConnect(true);
        },
    };

    private _onMessage = (data: WebSocket.Data) => {
        const intent = util.SafeJsonParse(String(data)) as Intent | null;
        intent && this._intentHandlers[intent.op]?.(intent);
    };

    private _identify = () => this._sessionId ?
        this._send(OPCode.RESUME, {
            token: this._auth?.authorization.token,
            session_id: this._sessionId,
            seq: this._lastSequence,
        }) :
        this._send(OPCode.IDENTIFY, {
            token: this._auth?.authorization.token,
            properties: this._props,
            intents: this._intents ?? helpers.Intents.SYSTEM,
            shard: this._shard,
        });

    private _sendHeartbeat = () => {
        if(this._lastHeartbeatAck) {
            if(this._ws && (this._ws.readyState == 1)) {
                this._lastHeartbeatAck = false;
                this._send(OPCode.HEARTBEAT, this._lastSequence);
            }
        } else {
            this.emit(ClientEvents.WARN, 'Heartbeat timeout.');
            this._wsConnect(true);
        }
    };

    private _setHeartbeatTimer = (interval?: number) => {
        if(this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = undefined;
        }
        if(interval)
            this._heartbeatTimer = setInterval(this._sendHeartbeat, interval);
    };

    private _onClose = (code: number) => {
        this._wsDisconnect(code);
        fatalCodes.includes(code) ?
            this.emit(ClientEvents.FATAL, `Fatal error. Code: ${code}`) :
            this._wsConnect(!dropCodes.includes(code));
    };

    private _onError = (error: Error) =>
        this.emit(ClientEvents.ERROR, error);

    Connect = (authorization: request.Authorization, intents?: helpers.Intents, shard?: { id: number; total: number; }) => {
        this._auth = { authorization };
        this._intents = intents;
        this._shard = shard ? [shard.id, shard.total] : undefined;
        this._wsConnect(true);
    };

    Disconnect = (code?: number) =>
        this._wsDisconnect(code);

    RequestGuildMembers = (params: { guild_id: string; presences?: boolean; nonce?: string; } &
        ({ query: string; limit: number; } | { user_ids: string | string[]; })
    ) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCode.REQUEST_GUILD_MEMBERS, params);
    };

    UpdateVoiceState = (params: {
        guild_id: string;
        channel_id: string | null;
        self_mute: boolean;
        self_deaf: boolean;
    }) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCode.VOICE_STATE_UPDATE, params);
    };

    UpdatePresence = (params: {
        since: number | null;
        activities: {
            name: string;
            type: helpers.ActivityTypes;
            url?: string;
        }[];
        status: helpers.StatusTypes;
        afk: boolean;
    }) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCode.PRESENCE_UPDATE, params);
    };

    get events() { return this._eventHandler; }
    get user() { return this._user; }

    get props() { return this._props; }
    set props(value) { this._props = value; }
}

export enum ClientEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    INTENT = 'intent',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
}

type ClientEventTypes = {
    [ClientEvents.CONNECT]: void;
    [ClientEvents.DISCONNECT]: number;
    [ClientEvents.INTENT]: { op: 0; s: number; t: string; d: any; };
    [ClientEvents.WARN]: string;
    [ClientEvents.ERROR]: Error;
    [ClientEvents.FATAL]: string;
};

export interface Client extends EventEmitter {
    on<K extends ClientEvents>(event: K, callback: (data: ClientEventTypes[K]) => void): this;
    once<K extends ClientEvents>(event: K, callback: (data: ClientEventTypes[K]) => void): this;
    off<K extends ClientEvents>(event: K, callback: (data: ClientEventTypes[K]) => void): this;
}
