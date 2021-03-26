import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { API_VERSION, OPCodes, Intents } from './helpers';
import { SafePromise, SafeJsonParse } from './util';
import { Request, Authorization, TokenTypes } from './request';

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

type ConnectionOptions = {
    token: string;
    intents: Intents;
    retryTimeout?: number;
};

export class Client extends EventEmitter {
    private _sessionId?: string;
    private _lastSequence = 0;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timeout;
    private _ws?: WebSocket;
    private _options: ConnectionOptions = { token: '', intents: 0 };

    constructor() {
        super();
    }

    private _wsConnect = async (resume?: boolean) => {
        this._wsDisconnect();

        if(!resume) {
            this._sessionId = undefined;
            this._lastSequence = 0;
        }

        const response = await SafePromise(Request('GET', '/gateway/bot', { authorization: new Authorization(TokenTypes.Bot, this._options.token) }));
        if(!response)
            return this.emit('fatal', 'Unable to retrieve a gateway.');

        if(typeof response.url != 'string')
            return this.emit('fatal', 'Unexpected gateway API response.');

        this._ws = new WebSocket(`${response.url}?v=${API_VERSION}`);
        this._ws.on('message', this._onMessage);
        this._ws.on('close', this._onClose);
        this._ws.on('error', this._onError);
    };

    private _wsDisconnect = (code = 1012) => {
        if(!this._ws) return;
        this.emit('disconnect', code);
        this._ws.removeAllListeners();
        this._ws.close(code);
        this._ws = undefined;
    };

    private _onMessage = (data: WebSocket.Data) => {
        if(typeof data != 'string')
            data = data.toString();

        const packet: { op: number; s?: number; t?: string; d?: any; } = SafeJsonParse(data);
        if(!packet) return;

        if(packet.s && (packet.s > this._lastSequence))
            this._lastSequence = packet.s;

        const op = packet.op;
        if(op == OPCode.DISPATCH) {
            const t = packet.t;
            if((t == 'READY') || (t == 'RESUMED')) {
                if(packet.d.session_id)
                    this._sessionId = packet.d.session_id;

                this._lastHeartbeatAck = true;
                this._sendHeartbeat();
                this.emit('connect');
            }
            this.emit('packet', packet);
        } else if(op == OPCode.HELLO) {
            this._identify();
            this._lastHeartbeatAck = true;
            this._setHeartbeatTimer(packet.d.heartbeat_interval);
        } else if(op == OPCode.HEARTBEAT_ACK) {
            this._lastHeartbeatAck = true;
        } else if(op == OPCode.HEARTBEAT) {
            this._sendHeartbeat();
        } else if(op == OPCode.INVALID_SESSION) {
            this.emit('warn', `Invalid session. Resumable: ${packet.d}`);
            this._wsConnect(packet.d);
        } else if(op == OPCode.RECONNECT) {
            this.emit('warn', 'Server forced reconnect.');
            this._wsConnect(true);
        }
    };

    private _identify = () => {
        this._ws && this._ws.send(JSON.stringify(this._sessionId ?
            {
                op: OPCode.RESUME,
                d: {
                    token: this._options.token,
                    session_id: this._sessionId,
                    seq: this._lastSequence,
                },
            } :
            {
                op: OPCode.IDENTIFY,
                d: {
                    token: this._options.token,
                    properties: { $os: 'linux', $browser: 'bot', $device: 'bot' },
                    intents: this._options.intents,
                },
            }
        ));
    };

    private _sendHeartbeat = () => {
        if(this._lastHeartbeatAck) {
            if(this._ws && (this._ws.readyState == 1)) {
                this._lastHeartbeatAck = false;
                this._ws.send(JSON.stringify({ op: OPCode.HEARTBEAT, d: this._lastSequence }));
            }
        } else {
            this.emit('warn', 'Heartbeat timeout.');
            this._wsConnect(true);
        }
    };

    private _setHeartbeatTimer = (interval: number) => {
        if(this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = undefined;
        }
        if(interval)
            this._heartbeatTimer = setInterval(this._sendHeartbeat, interval);
    };

    private _onClose = (code: number) => {
        this._wsDisconnect(code);
        this._wsConnect(true);
    };

    private _onError = (error: Error) => this.emit('error', error);

    Connect = (options: ConnectionOptions) => {
        this._options = { ...options };
        this._wsConnect();
    };

    Disconnect = (code?: number) => {
        this._wsDisconnect(code);
    };

    WsSend = (packet: { op: OPCodes | number; d: any; }) => {
        if(!this._ws) throw 'Unable to send packet: no connection.';
        this._ws.send((packet && (typeof packet == 'object')) ? JSON.stringify(packet) : packet);
    };
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
