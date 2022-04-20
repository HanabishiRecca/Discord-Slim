import { WebSocket, RawData } from 'ws';
import { EventEmitter } from 'events';
import { Intents, TokenTypes, API_VERSION, ActivityTypes, StatusTypes } from './helpers';
import { Sleep, SafeJsonParse, TimestampString } from './_common';
import { Authorization } from './request';
import { Gateway } from './actions';
import { Events, EventTypes, EventHandler } from './events';
import type { User, SessionStartLimit } from './types';

const enum OPCodes {
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

type DispatchPacket<E extends Events> = {
    t: E;
    s?: number;
    d: EventTypes[E];
};

type PacketTypes = {
    [OPCodes.DISPATCH]: DispatchPacket<Events>;
    [OPCodes.HELLO]: {
        d: { heartbeat_interval: number; };
    };
    [OPCodes.HEARTBEAT_ACK]: {};
    [OPCodes.HEARTBEAT]: {};
    [OPCodes.INVALID_SESSION]: {
        d: boolean;
    };
    [OPCodes.RECONNECT]: {};
};

type Packet<T extends keyof PacketTypes> = { op: T; } & PacketTypes[T];

type PacketHandlers = {
    [T in keyof PacketTypes]?: (data: Packet<T>) => void;
};

type DispatchHandlers = {
    [E in Events]?: (data: EventTypes[E]) => void;
};

const
    FATAL_CODES = Object.freeze([4004, 4010, 4011, 4012, 4013, 4014]),
    DROP_CODES = Object.freeze([4007, 4009]);

const AfterMessage = (after: number) =>
    `Reset after: ${TimestampString(Date.now() + after)}`;

export class Client extends EventEmitter {
    private _sessionId?: string;
    private _lastSequence = 0;
    private _lastHeartbeatAck = false;
    private _heartbeatTimer?: NodeJS.Timer;
    private _ws?: WebSocket;
    private _authorization?: Authorization;
    private _intents?: Intents;
    private _eventHandler = new EventEmitter() as EventHandler;
    private _user?: User;
    private _shard?: [number, number];
    private _props?: object | null = {
        $os: 'linux',
        $browser: 'bot',
        $device: 'bot',
    };

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

        const { _authorization: authorization } = this;

        const response: {
            url: string;
            session_start_limit?: SessionStartLimit;
        } | undefined = await (
            (authorization?.type == TokenTypes.BOT) ?
                Gateway.GetBot : Gateway.Get
        )({ authorization }).catch(() => undefined);

        if(this._ws)
            return this.emit(ClientEvents.WARN, 'The client is already connected.');

        if(!response)
            return this.emit(ClientEvents.FATAL, 'Unable to connect to the gateway API.');

        const { url, session_start_limit } = response;

        if(typeof url != 'string')
            return this.emit(ClientEvents.FATAL, 'Unexpected gateway API response.');

        if(!this._sessionId && session_start_limit) {
            const { remaining, total, reset_after } = session_start_limit;

            if(remaining < 1)
                return this.emit(ClientEvents.FATAL, `Max session start limit reached. ${AfterMessage(reset_after)}`);

            this.emit(ClientEvents.INFO, `Session starts avaliable: ${remaining}/${total}. ${AfterMessage(reset_after)}`);
        }

        try {
            this._ws = new WebSocket(`${url}?v=${API_VERSION}`);
        } catch(e) {
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

    private _send = (op: OPCodes, d: any) =>
        this._ws?.send(JSON.stringify({ op, d }));

    private _dispatchHandlers: DispatchHandlers = {
        [Events.READY]: ({ user, session_id }) => {
            this._user = user;
            this._sessionId = session_id;
            this.emit(ClientEvents.CONNECT);
        },

        [Events.RESUMED]: () =>
            this.emit(ClientEvents.CONNECT),

        [Events.USER_UPDATE]: (user) =>
            this._user = user,
    };

    private _packetHandlers: PacketHandlers = {
        [OPCodes.DISPATCH]: <E extends Events>(packet: DispatchPacket<E>) => {
            const { t, s, d } = packet;

            if(s && (s > this._lastSequence))
                this._lastSequence = s;

            this._dispatchHandlers[t]?.(d);
            this.emit(ClientEvents.INTENT, packet);
            this._eventHandler.emit(t, d);
        },

        [OPCodes.HELLO]: ({ d: { heartbeat_interval } }) => {
            this._identify();
            this._lastHeartbeatAck = true;
            this._setHeartbeatTimer(heartbeat_interval);
            this._sendHeartbeat();
        },

        [OPCodes.HEARTBEAT_ACK]: () =>
            this._lastHeartbeatAck = true,

        [OPCodes.HEARTBEAT]: () =>
            this._sendHeartbeat(),

        [OPCodes.INVALID_SESSION]: ({ d }) => {
            this.emit(ClientEvents.WARN, `Invalid session. Resumable: ${d}`);
            this._wsConnect(d);
        },

        [OPCodes.RECONNECT]: () => {
            this.emit(ClientEvents.WARN, 'Server forced reconnect.');
            this._wsConnect(true);
        },
    };

    private _onMessage = <T extends keyof PacketTypes>(data: RawData) => {
        const packet = SafeJsonParse<Packet<T>>(String(data));
        if(!packet) return;
        this._packetHandlers[packet.op]?.(packet);
    };

    private _identify = () => this._sessionId ?
        this._send(OPCodes.RESUME, {
            token: this._authorization?.token,
            session_id: this._sessionId,
            seq: this._lastSequence,
        }) :
        this._send(OPCodes.IDENTIFY, {
            token: this._authorization?.token,
            properties: this._props,
            intents: this._intents ?? Intents.SYSTEM,
            shard: this._shard,
        });

    private _sendHeartbeat = () => {
        if(this._ws?.readyState != 1) return;
        if(!this._lastHeartbeatAck) {
            this.emit(ClientEvents.WARN, 'Heartbeat timeout.');
            this._wsConnect(true);
            return;
        }
        this._lastHeartbeatAck = false;
        this._send(OPCodes.HEARTBEAT, this._lastSequence);
    };

    private _setHeartbeatTimer = (interval?: number) => {
        this._heartbeatTimer && clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = interval ?
            setInterval(this._sendHeartbeat, interval) : undefined;
    };

    private _onClose = (code: number) => {
        this._wsDisconnect(code);
        FATAL_CODES.includes(code) ?
            this.emit(ClientEvents.FATAL, `Fatal error. Code: ${code}`) :
            this._wsConnect(!DROP_CODES.includes(code));
    };

    private _onError = (error: Error) =>
        this.emit(ClientEvents.ERROR, error);

    Connect = (
        authorization: Authorization,
        intents?: Intents,
        shard?: {
            id: number;
            total: number;
        },
    ) => {
        this._authorization = authorization;
        this._intents = intents;
        this._shard = shard ?
            [shard.id, shard.total] : undefined;
        this._wsConnect(true);
    };

    Disconnect = (code?: number) =>
        this._wsDisconnect(code);

    RequestGuildMembers = (params: {
        guild_id: string;
        presences?: boolean;
        nonce?: string;
    } & ({
        query: string;
        limit: number;
    } | {
        user_ids: string | string[];
    })) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCodes.REQUEST_GUILD_MEMBERS, params);
    };

    UpdateVoiceState = (params: {
        guild_id: string;
        channel_id: string | null;
        self_mute: boolean;
        self_deaf: boolean;
    }) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCodes.VOICE_STATE_UPDATE, params);
    };

    UpdatePresence = (params: {
        since: number | null;
        activities: {
            name: string;
            type: ActivityTypes;
            url?: string;
        }[];
        status: StatusTypes;
        afk: boolean;
    }) => {
        if(!this._ws) throw 'No connection.';
        this._send(OPCodes.PRESENCE_UPDATE, params);
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
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
}

type DispatchPackets = {
    [E in Events]: DispatchPacket<E>;
};

type ClientEventTypes = {
    [ClientEvents.CONNECT]: void;
    [ClientEvents.DISCONNECT]: number;
    [ClientEvents.INTENT]: DispatchPackets[keyof DispatchPackets];
    [ClientEvents.INFO]: string;
    [ClientEvents.WARN]: string;
    [ClientEvents.ERROR]: Error;
    [ClientEvents.FATAL]: string;
};

export interface Client extends EventEmitter {
    on<E extends ClientEvents>(event: E, callback: (data: ClientEventTypes[E]) => void): this;
    once<E extends ClientEvents>(event: E, callback: (data: ClientEventTypes[E]) => void): this;
    off<E extends ClientEvents>(event: E, callback: (data: ClientEventTypes[E]) => void): this;
}
