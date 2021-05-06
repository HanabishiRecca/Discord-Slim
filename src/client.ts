import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { API_VERSION, Intents, ActivityTypes, StatusTypes } from './helpers';
import { SafeJsonParse, Sleep } from './util';
import { Request, Authorization, TokenTypes } from './request';
import type { EventHandler } from './events';
import type { User } from './types';

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

type Intent = (
    | { op: OPCode.HELLO; d: { heartbeat_interval: number; }; }
    | { op: OPCode.HEARTBEAT_ACK; }
    | { op: OPCode.HEARTBEAT; }
    | { op: OPCode.INVALID_SESSION; d: boolean; }
    | { op: OPCode.RECONNECT; }
    | { op: OPCode.DISPATCH; s?: number; } & (
        | { t: Events.READY; d: { session_id: string; user: User; }; }
        | { t: Events.RESUMED; d: null; }
    )
);

const
    fatalCodes = [4004, 4010, 4011, 4012, 4013, 4014],
    dropCodes = [4007, 4009];

export class Client extends EventEmitter {
    private _sessionId?: string;
    private _lastSequence = 0;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timeout;
    private _ws?: WebSocket;
    private _auth?: { authorization: Authorization; };
    private _intents?: Intents;
    private _eventHandler = new EventEmitter() as EventHandler;
    private _user?: User;
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
            await Sleep(5000);
        }

        const response = await Request('GET',
            this._auth?.authorization.type == TokenTypes.BOT ?
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

        this._ws = new WebSocket(`${response.url}?v=${API_VERSION}`);
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

    private _onMessage = (data: WebSocket.Data) => {
        const intent = SafeJsonParse(data.toString()) as Intent | null;
        if(!intent) return;

        switch(intent.op) {
            case OPCode.DISPATCH:
                if(intent.s && (intent.s > this._lastSequence))
                    this._lastSequence = intent.s;

                switch(intent.t) {
                    case Events.READY:
                        this._user = intent.d.user;
                        this._sessionId = intent.d.session_id;
                        this.emit(ClientEvents.CONNECT);
                        break;
                    case Events.RESUMED:
                        this.emit(ClientEvents.CONNECT);
                        break;
                }

                this.emit(ClientEvents.INTENT, intent);
                this._eventHandler.emit(intent.t, intent.d);
                break;
            case OPCode.HELLO:
                this._identify();
                this._lastHeartbeatAck = true;
                this._setHeartbeatTimer(intent.d.heartbeat_interval);
                this._sendHeartbeat();
                break;
            case OPCode.HEARTBEAT_ACK:
                this._lastHeartbeatAck = true;
                break;
            case OPCode.HEARTBEAT:
                this._sendHeartbeat();
                break;
            case OPCode.INVALID_SESSION:
                this.emit(ClientEvents.WARN, `Invalid session. Resumable: ${intent.d}`);
                this._wsConnect(intent.d);
                break;
            case OPCode.RECONNECT:
                this.emit(ClientEvents.WARN, 'Server forced reconnect.');
                this._wsConnect(true);
                break;
        }
    };

    private _identify = () =>
        this._sessionId ?
            this._send(OPCode.RESUME, {
                token: this._auth?.authorization.token,
                session_id: this._sessionId,
                seq: this._lastSequence,
            }) :
            this._send(OPCode.IDENTIFY, {
                token: this._auth?.authorization.token,
                properties: this._props,
                intents: this._intents ?? Intents.SYSTEM,
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

    Connect = (authorization: Authorization, intents?: Intents, shard?: { id: number; total: number; }) => {
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

    UpdateStatus = (params: {
        since: number | null;
        activities: {
            name: string;
            type: ActivityTypes;
            url?: string;
        }[] | null;
        status: StatusTypes;
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
