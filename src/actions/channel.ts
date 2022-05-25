import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Create = <T extends types.GuildChannel['type']>(guild_id: string, params: {
    name: string;
    type: T;
    position?: number;
    permission_overwrites?: types.PermissionsOverwrite[];
} & ({
    type: types.GuildTextChannel['type'];
    topic?: string;
    rate_limit_per_user?: number;
    parent_id?: string;
    nsfw?: boolean;
    default_auto_archive_duration?: helpers.ThreadArchiveDurations;
} | {
    type: types.GuildCategory['type'];
} | {
    type: types.GuildVoiceChannel['type'];
    bitrate?: number;
    user_limit?: number;
    parent_id?: string;
    rtc_region?: string;
    video_quality_mode?: helpers.VideoQualityModes;
}), requestOptions?: RequestOptions) =>
    Request<types.GuildChannel & {
        type: T;
    }>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions, params);

export const Get = <T extends types.GuildChannel>(channel_id: string, requestOptions?: RequestOptions) =>
    Request<T>(METHODS.GET, Path(PATHS.channels, channel_id), requestOptions);

export const Modify = <T extends types.GuildChannel>(id: string, params: {
    name?: string;
    position?: number | null;
    permission_overwrites?: types.PermissionsOverwrite[] | null;
} & ((T extends types.GuildTextChannel ? {
    type?: types.GuildTextChannel['type'];
    topic?: string | null;
    nsfw?: boolean | null;
    rate_limit_per_user?: number | null;
    parent_id?: string | null;
    default_auto_archive_duration?: helpers.ThreadArchiveDurations | null;
} : never) | (T extends types.GuildVoiceChannel ? {
    bitrate?: number | null;
    user_limit?: number | null;
    parent_id?: string | null;
    rtc_region?: string | null;
    video_quality_mode?: helpers.VideoQualityModes;
} : never)), requestOptions?: RequestOptions) =>
    Request<T>(METHODS.PATCH, Path(PATHS.channels, id), requestOptions, params);

export const Delete = <T extends types.GuildChannel>(channel_id: string, requestOptions?: RequestOptions) =>
    Request<T>(METHODS.DELETE, Path(PATHS.channels, channel_id), requestOptions);

export const GetMessages = (channel_id: string, params?: {
    limit?: number;
} & ({
    around?: string;
    before?: undefined;
    after?: undefined;
} | {
    around?: undefined;
    before?: string;
    after?: undefined;
} | {
    around?: undefined;
    before?: undefined;
    after?: string;
}), requestOptions?: RequestOptions) =>
    Request<types.Message[]>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages) + Query(params), requestOptions);

export const BulkDeleteMessages = (channel_id: string, params: {
    messages: string[];
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, PATHS.bulk_delete), requestOptions, params);

export const EditPermissions = (channel_id: string, overwrite_id: string, params: {
    allow?: string | null;
    deny?: string | null;
    type: helpers.PermissionsOverwriteTypes;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.permissions, overwrite_id), requestOptions, params);

export const GetInvites = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<(types.Invite & types.InviteMetadata)[]>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.invites), requestOptions);

export const DeletePermission = (channel_id: string, overwrite_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.permissions, overwrite_id), requestOptions);

export const FollowNews = (channel_id: string, params: {
    webhook_channel_id: string;
}, requestOptions?: RequestOptions) =>
    Request<types.FollowedChannel>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.followers), requestOptions, params);

export const TriggerTypingIndicator = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.typing), requestOptions);

export const GetPinnedMessages = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<types.Message[]>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.pins), requestOptions);

export const GetWebhooks = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<types.Webhook[]>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.webhooks), requestOptions);

export const ListPublicArchivedThreads = (channel_id: string, params?: {
    before?: string;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<{
        threads: types.Thread[];
        members: types.ThreadMember[];
        has_more: boolean;
    }>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.threads, PATHS.archived, PATHS.public) + Query(params), requestOptions);

export const ListPrivateArchivedThreads = (channel_id: string, params?: {
    before?: string;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<{
        threads: types.Thread[];
        members: types.ThreadMember[];
        has_more: boolean;
    }>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.threads, PATHS.archived, PATHS.private) + Query(params), requestOptions);

export const ListJoinedPrivateArchivedThreads = (channel_id: string, params?: {
    before?: string;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<{
        threads: types.Thread[];
        members: types.ThreadMember[];
        has_more: boolean;
    }>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.users, PATHS.me, PATHS.threads, PATHS.archived, PATHS.private) + Query(params), requestOptions);
