import WebSocket from 'ws';
import { EventEmitter } from 'events';
import * as helpers from './helpers';
import { SafePromise, SafeJsonParse, Sleep } from './util';
import { Request, Authorization } from './request';
import { EventHandler, GenericEvents } from './eventhandler';
import type { User, Activity } from './types';

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

export class Client extends EventEmitter {
    private _sessionId?: string;
    private _lastSequence = 0;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timeout;
    private _ws?: WebSocket;
    private _auth?: { authorization: Authorization; };
    private _intents?: helpers.Intents;
    private _eventHandler = new EventHandler<GenericEvents>();
    private _user?: User;

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

        const response = await SafePromise(Request('GET', '/gateway/bot', this._auth));
        if(!response)
            return this.emit('fatal', 'Unable to retrieve a gateway.');

        if(typeof response.url != 'string')
            return this.emit('fatal', 'Unexpected gateway API response.');

        this._ws = new WebSocket(`${response.url}?v=${helpers.API_VERSION}`);
        this._ws.on('message', this._onMessage);
        this._ws.on('close', this._onClose);
        this._ws.on('error', this._onError);
    };

    private _wsDisconnect = (code = 1012) => {
        if(!this._ws) return;
        this.emit('disconnect', code);
        this._setHeartbeatTimer();
        this._ws.removeAllListeners();
        this._ws.close(code);
        this._ws = undefined;
    };

    private _send = (op: OPCode, d: any) => this._ws && this._ws.send(JSON.stringify({ op, d }));

    private _onMessage = (data: WebSocket.Data) => {
        if(typeof data != 'string')
            data = data.toString();

        const intent = SafeJsonParse(data) as Intent | null;
        if(!intent) return;

        if(intent.op == OPCode.DISPATCH) {
            if(intent.s && (intent.s > this._lastSequence))
                this._lastSequence = intent.s;

            if(intent.t == Events.READY) {
                this._user = intent.d.user;
                this._sessionId = intent.d.session_id;
                this._lastHeartbeatAck = true;
                this._sendHeartbeat();
                this.emit('connect');
            } else if(intent.t == Events.RESUMED) {
                this._lastHeartbeatAck = true;
                this._sendHeartbeat();
                this.emit('connect');
            }

            this.emit('intent', intent);
            this._eventHandler.emit(intent.t, intent.d);
        } else if(intent.op == OPCode.HELLO) {
            this._identify();
            this._lastHeartbeatAck = true;
            this._setHeartbeatTimer(intent.d.heartbeat_interval);
        } else if(intent.op == OPCode.HEARTBEAT_ACK) {
            this._lastHeartbeatAck = true;
        } else if(intent.op == OPCode.HEARTBEAT) {
            this._sendHeartbeat();
        } else if(intent.op == OPCode.INVALID_SESSION) {
            this.emit('warn', `Invalid session. Resumable: ${intent.d}`);
            this._wsConnect(intent.d);
        } else if(intent.op == OPCode.RECONNECT) {
            this.emit('warn', 'Server forced reconnect.');
            this._wsConnect(true);
        }
    };

    private _identify = () => {
        this._sessionId ?
            this._send(OPCode.RESUME, {
                token: this._auth?.authorization.token,
                session_id: this._sessionId,
                seq: this._lastSequence,
            }) :
            this._send(OPCode.IDENTIFY, {
                token: this._auth?.authorization.token,
                properties: { $os: 'linux', $browser: 'bot', $device: 'bot' },
                intents: this._intents ?? helpers.Intents.SYSTEM_ONLY,
            });
    };

    private _sendHeartbeat = () => {
        if(this._lastHeartbeatAck) {
            if(this._ws && (this._ws.readyState == 1)) {
                this._lastHeartbeatAck = false;
                this._send(OPCode.HEARTBEAT, this._lastSequence);
            }
        } else {
            this.emit('warn', 'Heartbeat timeout.');
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
        if(code < 4000)
            this._wsConnect(true);
        else
            this.emit('fatal', `Fatal gateway error. Code: ${code}`);
    };

    private _onError = (error: Error) => this.emit('error', error);

    Connect = (authorization: Authorization, intents?: helpers.Intents) => {
        this._auth = { authorization };
        this._intents = intents;
        this._wsConnect(true);
    };

    Disconnect = (code?: number) => {
        this._wsDisconnect(code);
    };

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
        activities: Activity[] | null;
        status: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline';
        afk: boolean;
    }) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCode.PRESENCE_UPDATE, params);
    };

    get events() { return this._eventHandler; }
    get user() { return this._user; }
}

export interface Client {
    on(event: 'connect', listener: (this: this) => void): this;
    on(event: 'disconnect', listener: (this: this, code: number) => void): this;
    on(event: 'intent', listener: (this: this, intent: { op: number; s: number; t: string; d: any; }) => void): this;
    on(event: 'warn', listener: (this: this, message: string) => void): this;
    on(event: 'error', listener: (this: this, message: string) => void): this;
    on(event: 'fatal', listener: (this: this, message: string) => void): this;

    off(event: 'connect', listener: (this: this) => void): this;
    off(event: 'disconnect', listener: (this: this, code: number) => void): this;
    off(event: 'intent', listener: (this: this, intent: { op: number; s: number; t: string; d: any; }) => void): this;
    off(event: 'warn', listener: (this: this, message: string) => void): this;
    off(event: 'error', listener: (this: this, message: string) => void): this;
    off(event: 'fatal', listener: (this: this, message: string) => void): this;

    once(event: 'connect', listener: (this: this) => void): this;
    once(event: 'disconnect', listener: (this: this, code: number) => void): this;
    once(event: 'intent', listener: (this: this, intent: { op: number; s: number; t: string; d: any; }) => void): this;
    once(event: 'warn', listener: (this: this, message: string) => void): this;
    once(event: 'error', listener: (this: this, message: string) => void): this;
    once(event: 'fatal', listener: (this: this, message: string) => void): this;
}
