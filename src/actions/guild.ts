import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const GetAuditLog = (guild_id: string, params?: {
    user_id?: string;
    action_type?: number;
    before?: string;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<types.AuditLog>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.auditLogs) + Query(params), requestOptions);

export const ListEmojis = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Emoji[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.emojis), requestOptions);

export const Create = (params: {
    name: string;
    icon?: string;
    verification_level?: helpers.VerificationLevels;
    default_message_notifications?: helpers.DefaultMessageNotificationLevels;
    explicit_content_filter?: helpers.ExplicitContentFilterLevels;
    roles?: types.Role[];
    channels?: types.GuildChannel[];
    afk_channel_id?: string;
    afk_timeout?: number;
    system_channel_id?: string;
    system_channel_flags?: helpers.SystemChannelFlags;
}, requestOptions?: RequestOptions) =>
    Request<types.Guild>(METHODS.POST, PATHS.guilds, requestOptions, params);

export const Get = (guild_id: string, params?: {
    with_counts?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.Guild>(METHODS.GET, Path(PATHS.guilds, guild_id) + Query(params), requestOptions);

export const GetPreview = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildPreview>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.preview), requestOptions);

export const Modify = (guild_id: string, params: {
    name?: string;
    verification_level?: helpers.VerificationLevels;
    default_message_notifications?: helpers.DefaultMessageNotificationLevels;
    explicit_content_filter?: helpers.ExplicitContentFilterLevels;
    afk_channel_id?: string | null;
    afk_timeout?: number;
    icon?: string | null;
    owner_id?: string;
    splash?: string | null;
    discovery_splash?: string | null;
    banner?: string | null;
    system_channel_id?: string | null;
    system_channel_flags?: helpers.SystemChannelFlags;
    rules_channel_id?: string | null;
    public_updates_channel_id?: string | null;
    preferred_locale?: string | null;
    features?: helpers.GuildFeatures[];
    description?: string | null;
    premium_progress_bar_enabled?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.Guild>(METHODS.PATCH, Path(PATHS.guilds, guild_id), requestOptions, params);

export const Delete = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id), requestOptions);

export const GetChannels = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildChannel[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions);

export const ModifyChannelPositions = (guild_id: string, params: ({
    id: string;
    position: number | null;
})[], requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions, params);

export const ListActiveThreads = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<{
        threads: types.Thread[];
        members: types.ThreadMember[];
    }>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.threads, PATHS.active), requestOptions);

export const ListMembers = (guild_id: string, params?: {
    limit?: number;
    after?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Member[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members) + Query(params), requestOptions);

export const SearchMembers = (guild_id: string, params: {
    query: number;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<types.Member[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members, PATHS.search) + Query(params), requestOptions);

export const GetBans = (guild_id: string, params?: {
    limit?: number;
} & ({
    before?: string;
    after?: undefined;
} | {
    before?: undefined;
    after?: string;
}), requestOptions?: RequestOptions) =>
    Request<types.Ban[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.bans) + Query(params), requestOptions);

export const GetRoles = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Role[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions);

export const ModifyRolePositions = (guild_id: string, params: ({
    id: string;
    position?: number | null;
})[], requestOptions?: RequestOptions) =>
    Request<types.Role[]>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions, params);

export const GetPruneCount = (guild_id: string, params?: {
    days?: number;
    include_roles?: string;
}, requestOptions?: RequestOptions) =>
    Request<{ pruned: number; }>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.prune) + Query(params), requestOptions);

export const Prune = (guild_id: string, params?: {
    days?: number;
    compute_prune_count?: boolean;
    include_roles?: string;
}, requestOptions?: RequestOptions) =>
    Request<{ pruned: number | null; }>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.prune), requestOptions, params);

export const GetVoiceRegions = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.VoiceRegion[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.regions), requestOptions);

export const GetInvites = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<(types.Invite & types.InviteMetadata)[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.invites), requestOptions);

export const GetIntegrations = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Integration[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.integrations), requestOptions);

export const DeleteIntegration = (guild_id: string, integration_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.integrations, integration_id), requestOptions);

export const GetVanityURL = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<{ code: string; uses: number; }>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.vanity_url), requestOptions);

export const CreateFromTemplate = (template_code: string, params: {
    name: string;
    icon?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Guild>(METHODS.POST, Path(PATHS.guilds, PATHS.templates, template_code), requestOptions, params);

export const GetTemplates = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Template[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.templates), requestOptions);

export const GetWebhooks = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Webhook[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.webhooks), requestOptions);

export const ListStickers = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Sticker[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.stickers), requestOptions);

export const ListScheduledEvents = (guild_id: string, params?: {
    with_user_count?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.ScheduledEvent[]>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.scheduled_events) + Query(params), requestOptions);
