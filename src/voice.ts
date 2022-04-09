import { WebSocket, RawData } from 'ws';
import { EventEmitter } from 'events';
import { Sleep, SafeJsonParse } from './_common';
import { VoiceEncryptionModes, SpeakingStates } from './helpers';

const enum OPCode {
    IDENTIFY = 0,
    SELECT_PROTOCOL = 1,
    READY = 2,
    HEARTBEAT = 3,
    SESSION_DESCRIPTION = 4,
    SPEAKING = 5,
    HEARTBEAT_ACK = 6,
    RESUME = 7,
    HELLO = 8,
    RESUMED = 9,
    CLIENT_DISCONNECT = 13,
}

type Intent = {
    op: (
        | OPCode.HELLO
        | OPCode.READY
        | OPCode.SESSION_DESCRIPTION
        | OPCode.HEARTBEAT_ACK
    );
    d: any;
};

const
    VOICE_VERSION = 4,
    FATAL_CODES = Object.freeze([4002, 4004, 4006, 4011, 4014]),
    DROP_CODES = Object.freeze([4009]);

export class Voice extends EventEmitter {
    private _ws?: WebSocket;
    private _options?: {
        server_id: string;
        user_id: string;
        session_id: string;
        token: string;
    };
    private _endpoint?: string;
    private _encryption?: string;
    private _resume = false;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timer;
    private _broadcast?: {
        ip: string;
        port: number;
        ssrc: number;
    };
    private _ssrc?: number;

    constructor() {
        super();
    }

    private _wsConnect = async (resume?: boolean) => {
        this._wsDisconnect();

        if(!resume) {
            this._resume = false;
            await Sleep(5000);
        }

        if(this._ws)
            return this.emit(VoiceEvents.WARN, 'Voice already connected.');

        this._ws = new WebSocket(`wss://${this._endpoint}?v=${VOICE_VERSION}`);
        this._ws.on('message', this._onMessage);
        this._ws.on('close', this._onClose);
        this._ws.on('error', this._onError);
    };

    private _wsDisconnect = (code = 1012) => {
        if(!this._ws) return;
        this.emit(VoiceEvents.DISCONNECT, code);
        this._setHeartbeatTimer();
        this._ws.removeAllListeners();
        this._ws.close(code);
        this._ws = undefined;
    };

    private _send = (op: OPCode, d: any) =>
        this._ws?.send(JSON.stringify({ op, d }));

    private _intentHandlers = {
        [OPCode.HELLO]: ({ heartbeat_interval }: {
            heartbeat_interval: number;
        }) => {
            this._send(
                this._resume ?
                    OPCode.RESUME : OPCode.IDENTIFY,
                this._options,
            );
            this._resume = true;
            this._lastHeartbeatAck = true;
            this._setHeartbeatTimer(heartbeat_interval);
            this._sendHeartbeat();
        },

        [OPCode.READY]: ({ ssrc, ip, port }: {
            ssrc: number;
            ip: string;
            port: number;
        }) => {
            this._broadcast = { ssrc, ip, port };
            this._send(OPCode.SELECT_PROTOCOL, {
                protocol: 'udp',
                data: {
                    address: ip,
                    port,
                    mode: this._encryption,
                },
            });
        },

        [OPCode.SESSION_DESCRIPTION]: ({ secret_key }: {
            secret_key: number[];
        }) => {
            this.emit(VoiceEvents.CONNECT, {
                ...this._broadcast,
                secret_key,
            });
        },

        [OPCode.HEARTBEAT_ACK]: () =>
            this._lastHeartbeatAck = true,
    };

    private _onMessage = (data: RawData) => {
        const intent = SafeJsonParse<Intent>(String(data));
        intent && this._intentHandlers[intent.op]?.(intent.d);
    };

    private _sendHeartbeat = () => {
        if(this._ws?.readyState != 1) return;
        if(!this._lastHeartbeatAck) {
            this.emit(VoiceEvents.WARN, 'Heartbeat timeout.');
            this._wsConnect(true);
            return;
        }
        this._lastHeartbeatAck = false;
        this._send(OPCode.HEARTBEAT, null);
    };

    private _setHeartbeatTimer = (interval?: number) => {
        this._heartbeatTimer && clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = interval ?
            setInterval(this._sendHeartbeat, interval) : undefined;
    };

    private _onClose = (code: number) => {
        this._wsDisconnect(code);
        FATAL_CODES.includes(code) ?
            this.emit(VoiceEvents.FATAL, `Fatal error. Code: ${code}`) :
            this._wsConnect(!DROP_CODES.includes(code));
    };

    private _onError = (error: Error) =>
        this.emit(VoiceEvents.ERROR, error);

    Connect = (
        server_id: string,
        user_id: string,
        session_id: string,
        token: string,
        endpoint: string,
        encryption: VoiceEncryptionModes,
    ) => {
        this._options = { token, server_id, user_id, session_id };
        this._endpoint = endpoint;
        this._encryption = encryption;
        this._resume = false;
        this._wsConnect(true);
    };

    Disconnect = (code?: number) =>
        this._wsDisconnect(code);

    SetSpeakingState = (speaking: SpeakingStates, delay = 0) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCode.SPEAKING, {
            speaking,
            delay,
            ssrc: this._ssrc,
        });
    };
}

export enum VoiceEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
}

type VoiceEventTypes = {
    [VoiceEvents.CONNECT]: {
        ip: string;
        port: number;
        ssrc: number;
        secret_key: number[];
    };
    [VoiceEvents.DISCONNECT]: number;
    [VoiceEvents.WARN]: string;
    [VoiceEvents.ERROR]: Error;
    [VoiceEvents.FATAL]: string;
};

export interface Voice extends EventEmitter {
    on<K extends VoiceEvents>(event: K, callback: (data: VoiceEventTypes[K]) => void): this;
    once<K extends VoiceEvents>(event: K, callback: (data: VoiceEventTypes[K]) => void): this;
    off<K extends VoiceEvents>(event: K, callback: (data: VoiceEventTypes[K]) => void): this;
}
