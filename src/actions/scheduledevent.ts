import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Create = (guild_id: string, params: {
    channel_id?: string;
    entity_metadata?: types.ScheduledEventEntityMetadata;
    name: string;
    privacy_level: helpers.PrivacyLevels;
    scheduled_start_time: string;
    scheduled_end_time?: string;
    description?: string;
    entity_type: helpers.ScheduledEventEntityTypes;
    image?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.ScheduledEvent>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.scheduled_events), requestOptions, params);

export const Get = (guild_id: string, event_id: string, params?: {
    with_user_count?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.ScheduledEvent>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.scheduled_events, event_id) + Query(params), requestOptions);

export const Modify = (guild_id: string, event_id: string, params: {
    channel_id?: string | null;
    entity_metadata?: types.ScheduledEventEntityMetadata | null;
    name?: string;
    privacy_level?: helpers.PrivacyLevels;
    scheduled_start_time?: string;
    scheduled_end_time?: string;
    description?: string | null;
    entity_type?: helpers.ScheduledEventEntityTypes;
    status?: helpers.ScheduledEventStatuses;
    image?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.ScheduledEvent>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.scheduled_events, event_id), requestOptions, params);

export const Delete = (guild_id: string, event_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.scheduled_events, event_id), requestOptions);

export const GetUsers = (guild_id: string, event_id: string, params?: {
    limit?: number;
    with_member?: boolean;
} & ({
    before?: string;
    after?: undefined;
} | {
    before?: undefined;
    after?: string;
}), requestOptions?: RequestOptions) =>
    Request<types.ScheduledEventUser[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.scheduled_events, event_id, PATHS.users) + Query(params), requestOptions);
