import type { EventEmitter } from 'events';
import type { InviteTargetTypes } from './helpers';
import type * as types from './types';

export enum Events {
    READY = 'READY',
    RESUMED = 'RESUMED',
    CHANNEL_CREATE = 'CHANNEL_CREATE',
    CHANNEL_UPDATE = 'CHANNEL_UPDATE',
    CHANNEL_DELETE = 'CHANNEL_DELETE',
    CHANNEL_PINS_UPDATE = 'CHANNEL_PINS_UPDATE',
    GUILD_CREATE = 'GUILD_CREATE',
    GUILD_UPDATE = 'GUILD_UPDATE',
    GUILD_DELETE = 'GUILD_DELETE',
    GUILD_BAN_ADD = 'GUILD_BAN_ADD',
    GUILD_BAN_REMOVE = 'GUILD_BAN_REMOVE',
    GUILD_EMOJIS_UPDATE = 'GUILD_EMOJIS_UPDATE',
    GUILD_INTEGRATIONS_UPDATE = 'GUILD_INTEGRATIONS_UPDATE',
    GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD',
    GUILD_MEMBER_REMOVE = 'GUILD_MEMBER_REMOVE',
    GUILD_MEMBER_UPDATE = 'GUILD_MEMBER_UPDATE',
    GUILD_MEMBERS_CHUNK = 'GUILD_MEMBERS_CHUNK',
    GUILD_ROLE_CREATE = 'GUILD_ROLE_CREATE',
    GUILD_ROLE_UPDATE = 'GUILD_ROLE_UPDATE',
    GUILD_ROLE_DELETE = 'GUILD_ROLE_DELETE',
    GUILD_SCHEDULED_EVENT_CREATE = 'GUILD_SCHEDULED_EVENT_CREATE',
    GUILD_SCHEDULED_EVENT_UPDATE = 'GUILD_SCHEDULED_EVENT_UPDATE',
    GUILD_SCHEDULED_EVENT_DELETE = 'GUILD_SCHEDULED_EVENT_DELETE',
    GUILD_SCHEDULED_EVENT_USER_ADD = 'GUILD_SCHEDULED_EVENT_USER_ADD',
    GUILD_SCHEDULED_EVENT_USER_REMOVE = 'GUILD_SCHEDULED_EVENT_USER_REMOVE',
    INTERACTION_CREATE = 'INTERACTION_CREATE',
    INVITE_CREATE = 'INVITE_CREATE',
    INVITE_DELETE = 'INVITE_DELETE',
    MESSAGE_CREATE = 'MESSAGE_CREATE',
    MESSAGE_UPDATE = 'MESSAGE_UPDATE',
    MESSAGE_DELETE = 'MESSAGE_DELETE',
    MESSAGE_DELETE_BULK = 'MESSAGE_DELETE_BULK',
    MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD',
    MESSAGE_REACTION_REMOVE = 'MESSAGE_REACTION_REMOVE',
    MESSAGE_REACTION_REMOVE_ALL = 'MESSAGE_REACTION_REMOVE_ALL',
    MESSAGE_REACTION_REMOVE_EMOJI = 'MESSAGE_REACTION_REMOVE_EMOJI',
    PRESENCE_UPDATE = 'PRESENCE_UPDATE',
    STAGE_INSTANCE_CREATE = 'STAGE_INSTANCE_CREATE',
    STAGE_INSTANCE_UPDATE = 'STAGE_INSTANCE_UPDATE',
    STAGE_INSTANCE_DELETE = 'STAGE_INSTANCE_DELETE',
    THREAD_CREATE = 'THREAD_CREATE',
    THREAD_UPDATE = 'THREAD_UPDATE',
    THREAD_DELETE = 'THREAD_DELETE',
    THREAD_LIST_SYNC = 'THREAD_LIST_SYNC',
    THREAD_MEMBER_UPDATE = 'THREAD_MEMBER_UPDATE',
    THREAD_MEMBERS_UPDATE = 'THREAD_MEMBERS_UPDATE',
    TYPING_START = 'TYPING_START',
    USER_UPDATE = 'USER_UPDATE',
    VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
    VOICE_SERVER_UPDATE = 'VOICE_SERVER_UPDATE',
    WEBHOOKS_UPDATE = 'WEBHOOKS_UPDATE',
}

type EventTypes = {
    [Events.READY]: {
        v: number;
        user: types.User;
        guilds: types.UnavailableGuild[];
        session_id: string;
        shard?: [shard_id: number, num_shards: number];
        application: {
            id: string;
            flags: number;
        };
    };
    [Events.RESUMED]: {};
    [Events.CHANNEL_CREATE]: types.Channel;
    [Events.CHANNEL_UPDATE]: types.Channel;
    [Events.CHANNEL_DELETE]: types.Channel;
    [Events.CHANNEL_PINS_UPDATE]: {
        guild_id?: string;
        channel_id: string;
        last_pin_timestamp?: string | null;
    };
    [Events.THREAD_CREATE]: types.Channel;
    [Events.THREAD_UPDATE]: types.Channel;
    [Events.THREAD_DELETE]: types.Channel;
    [Events.THREAD_LIST_SYNC]: {
        guild_id: string;
        channel_ids?: string[];
        threads: types.Channel[];
        members: types.ThreadMember[];
    };
    [Events.THREAD_MEMBER_UPDATE]: types.ThreadMember & { guild_id: string; };
    [Events.THREAD_MEMBERS_UPDATE]: {
        id: string;
        guild_id: string;
        member_count: number;
        added_members?: (types.ThreadMember & types.Member & types.Presence)[];
        removed_member_ids?: string[];
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
        avatar: string | null;
        joined_at: string | null;
        premium_since?: string | null;
        deaf?: boolean;
        mute?: boolean;
        pending?: boolean;
        communication_disabled_until?: string | null;
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
        created_at: string;
        guild_id?: string;
        inviter?: types.User;
        max_age: number;
        max_uses: number;
        target_type?: InviteTargetTypes;
        target_user?: types.User;
        target_application?: types.Application;
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
    [Events.STAGE_INSTANCE_CREATE]: types.StageInstance;
    [Events.STAGE_INSTANCE_UPDATE]: types.StageInstance;
    [Events.STAGE_INSTANCE_DELETE]: types.StageInstance;
    [Events.GUILD_SCHEDULED_EVENT_CREATE]: types.ScheduledEvent;
    [Events.GUILD_SCHEDULED_EVENT_UPDATE]: types.ScheduledEvent;
    [Events.GUILD_SCHEDULED_EVENT_DELETE]: types.ScheduledEvent;
    [Events.GUILD_SCHEDULED_EVENT_USER_ADD]: {
        guild_scheduled_event_id: string;
        user_id: string;
        guild_id: string;
    };
    [Events.GUILD_SCHEDULED_EVENT_USER_REMOVE]: {
        guild_scheduled_event_id: string;
        user_id: string;
        guild_id: string;
    };
};

export interface EventHandler extends EventEmitter {
    on<K extends Events>(event: K, callback: (data: EventTypes[K]) => void): this;
    once<K extends Events>(event: K, callback: (data: EventTypes[K]) => void): this;
    off<K extends Events>(event: K, callback: (data: EventTypes[K]) => void): this;
}
