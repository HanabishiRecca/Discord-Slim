import { EventEmitter } from 'events';
import type * as types from './types';
import type { Events, TargetUserTypes } from './helpers';

export type GenericEvents = {
    [Events.READY]: {
        v: number;
        user: types.User;
        private_channels: [];
        guilds: types.UnavailableGuild[];
        session_id: string;
        shard?: [shard_id: number, num_shards: number];
        application: {
            id: string;
            flags: number;
        };
    };
    [Events.RESUMED]: null;
    [Events.APPLICATION_COMMAND_CREATE]: types.ApplicationCommand & { guild_id?: string; };
    [Events.APPLICATION_COMMAND_UPDATE]: types.ApplicationCommand & { guild_id?: string; };
    [Events.APPLICATION_COMMAND_DELETE]: types.ApplicationCommand & { guild_id?: string; };
    [Events.CHANNEL_CREATE]: types.Channel;
    [Events.CHANNEL_UPDATE]: types.Channel;
    [Events.CHANNEL_DELETE]: types.Channel;
    [Events.CHANNEL_PINS_UPDATE]: {
        guild_id?: string;
        channel_id: string;
        last_pin_timestamp?: string | null;
    };
    [Events.GUILD_CREATE]: types.Guild;
    [Events.GUILD_UPDATE]: types.Guild;
    [Events.GUILD_DELETE]: types.UnavailableGuild;
    [Events.GUILD_BAN_ADD]: {
        guild_id: string;
        user: types.User;
    };
    [Events.GUILD_BAN_REMOVE]: {
        guild_id: string;
        user: types.User;
    };
    [Events.GUILD_EMOJIS_UPDATE]: {
        guild_id: string;
        user: types.Emoji[];
    };
    [Events.GUILD_INTEGRATIONS_UPDATE]: { guild_id: string; };
    [Events.GUILD_MEMBER_ADD]: types.Member & { guild_id: string; };
    [Events.GUILD_MEMBER_REMOVE]: {
        guild_id: string;
        user: types.User;
    };
    [Events.GUILD_MEMBER_UPDATE]: {
        guild_id: string;
        roles: string[];
        user: types.User;
        nick?: string | null;
        joined_at: string;
        premium_since?: string | null;
        pending?: boolean;
    };
    [Events.GUILD_MEMBERS_CHUNK]: {
        guild_id: string;
        members: types.Member[];
        chunk_index: number;
        chunk_count: number;
        not_found?: [];
        presences?: types.Presence[];
        nonce?: string;
    };
    [Events.GUILD_ROLE_CREATE]: {
        guild_id: string;
        role: types.Role;
    };
    [Events.GUILD_ROLE_UPDATE]: {
        guild_id: string;
        role: types.Role;
    };
    [Events.GUILD_ROLE_DELETE]: {
        guild_id: string;
        role_id: string;
    };
    [Events.INTERACTION_CREATE]: types.Interaction;
    [Events.INVITE_CREATE]: {
        channel_id: string;
        code: string;
        created_at: number;
        guild_id?: string;
        inviter?: types.User;
        max_age: number;
        max_uses: number;
        target_user?: types.User;
        target_user_type?: TargetUserTypes;
        temporary: boolean;
        uses: number;
    };
    [Events.INVITE_DELETE]: {
        channel_id: string;
        guild_id?: string;
        code: string;
    };
    [Events.MESSAGE_CREATE]: types.Message;
    [Events.MESSAGE_UPDATE]: types.Message;
    [Events.MESSAGE_DELETE]: {
        id: string;
        channel_id: string;
        guild_id?: string;
    };
    [Events.MESSAGE_DELETE_BULK]: {
        ids: string[];
        channel_id: string;
        guild_id?: string;
    };
    [Events.MESSAGE_REACTION_ADD]: {
        user_id: string;
        channel_id: string;
        message_id: string;
        guild_id?: string;
        member?: types.Member;
        emoji: types.Emoji;
    };
    [Events.MESSAGE_REACTION_REMOVE]: {
        user_id: string;
        channel_id: string;
        message_id: string;
        guild_id?: string;
        emoji: types.Emoji;
    };
    [Events.MESSAGE_REACTION_REMOVE_ALL]: {
        channel_id: string;
        message_id: string;
        guild_id?: string;
    };
    [Events.MESSAGE_REACTION_REMOVE_EMOJI]: {
        channel_id: string;
        guild_id?: string;
        message_id: string;
        emoji: types.Emoji;
    };
    [Events.PRESENCE_UPDATE]: types.Presence;
    [Events.TYPING_START]: {
        channel_id: string;
        guild_id?: string;
        user_id: string;
        timestamp: number;
        member?: types.Member;
    };
    [Events.USER_UPDATE]: types.User;
    [Events.VOICE_STATE_UPDATE]: types.VoiceState;
    [Events.VOICE_SERVER_UPDATE]: {
        token: string;
        guild_id: string;
        endpoint: string;
    };
    [Events.WEBHOOKS_UPDATE]: {
        guild_id: string;
        channel_id: string;
    };
};

type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export class EventHandler<T extends EventMap> {
    private _em = new EventEmitter();
    on = <K extends EventKey<T>>(event: K, callback: EventReceiver<T[K]>) => this._em.on(event, callback);
    once = <K extends EventKey<T>>(event: K, callback: EventReceiver<T[K]>) => this._em.once(event, callback);
    off = <K extends EventKey<T>>(event: K, callback: EventReceiver<T[K]>) => this._em.off(event, callback);
    emit = <K extends EventKey<T>>(event: K | string, params: T[K] | any) => this._em.emit(event, params);
}
