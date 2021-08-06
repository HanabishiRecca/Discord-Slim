import { Request, RequestOptions } from './request';
import { URLSearchParams } from 'url';
import type * as helpers from './helpers';
import type * as types from './types';

export { SetDefOptions as setDefaultRequestOptions } from './request';

const
    Path = (...paths: string[]) => paths.join('/'),
    Param = (params: any) => String(new URLSearchParams(params)),
    Query = (params: any) => params ? '?' + Param(params) : '';

const enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

const enum PATHS {
    active = 'active',
    applications = 'applications',
    archived = 'archived',
    auditLogs = 'audit-logs',
    bans = 'bans',
    bulk_delete = 'bulk-delete',
    callback = 'callback',
    channels = 'channels',
    commands = 'commands',
    connections = 'connections',
    crosspost = 'crosspost',
    emojis = 'emojis',
    followers = 'followers',
    github = 'github',
    guilds = 'guilds',
    integrations = 'integrations',
    interactions = 'interactions',
    invites = 'invites',
    me = '@me',
    members = 'members',
    messages = 'messages',
    nick = 'nick',
    oauth2 = 'oauth2',
    original = '@original',
    permissions = 'permissions',
    pins = 'pins',
    preview = 'preview',
    private = 'private',
    prune = 'prune',
    public = 'public',
    reactions = 'reactions',
    recipients = 'recipients',
    regions = 'regions',
    roles = 'roles',
    search = 'search',
    slack = 'slack',
    stage_instances = 'stage-instances',
    sync = 'sync',
    templates = 'templates',
    thread_members = 'thread-members',
    threads = 'threads',
    token = 'token',
    typing = 'typing',
    users = 'users',
    vanity_url = 'vanity-url',
    voice = 'voice',
    voice_states = 'voice-states',
    webhooks = 'webhooks',
    welcome_screen = 'welcome-screen',
    widget = 'widget',
    widget_json = 'widget.json',
    widget_png = 'widget.png',
}

export const Channel = {
    Create: (guild_id: string, params: {
        name: string;
        type?: helpers.ChannelTypes;
        topic?: string;
        bitrate?: number;
        user_limit?: number;
        rate_limit_per_user?: number;
        position?: number;
        permission_overwrites?: types.PermissionsOverwrite[];
        parent_id?: string;
        nsfw?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions, params),

    Get: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id), requestOptions),

    Modify: (id: string, params: {
        name?: string;
        type?: helpers.ChannelTypes;
        position?: number | null;
        topic?: string | null;
        nsfw?: boolean | null;
        rate_limit_per_user?: number | null;
        bitrate?: number | null;
        user_limit?: number | null;
        permission_overwrites?: types.PermissionsOverwrite[] | null;
        parent_id?: string | null;
        rtc_region?: string | null;
        video_quality_mode?: helpers.VideoQualityModes;
        default_auto_archive_duration?: helpers.ThreadArchiveDuration | null;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, Path(PATHS.channels, id), requestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id), requestOptions),

    GetMessages: (channel_id: string, params?: {
        around?: string;
        before?: string;
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Message[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages), requestOptions, params),

    BulkDeleteMessages: (channel_id: string, params: {
        messages: string[];
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, PATHS.bulk_delete), requestOptions, params),

    EditPermissions: (channel_id: string, overwrite_id: string, params: {
        allow: string;
        deny: string;
        type: helpers.PermissionsOverwriteTypes,
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.permissions, overwrite_id), requestOptions, params),

    GetInvites: (channel_id: string, requestOptions?: RequestOptions): Promise<(types.Invite & types.InviteMetadata)[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.invites), requestOptions),

    DeletePermission: (channel_id: string, overwrite_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.permissions, overwrite_id), requestOptions),

    FollowNews: (channel_id: string, params: {
        webhook_channel_id: string;
    }, requestOptions?: RequestOptions): Promise<types.FollowedChannel> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.followers), requestOptions, params),

    TriggerTypingIndicator: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.typing), requestOptions),

    GetPinnedMessages: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Message[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.pins), requestOptions),

    GetWebhooks: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Webhook[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.webhooks), requestOptions),

    ListActiveThreads: (channel_id: string, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.threads, PATHS.active), requestOptions),

    ListPublicArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.threads, PATHS.archived, PATHS.public) + Query(params), requestOptions),

    ListPrivateArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.threads, PATHS.archived, PATHS.private) + Query(params), requestOptions),

    ListJoinedPrivateArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.users, PATHS.me, PATHS.threads, PATHS.archived, PATHS.private) + Query(params), requestOptions),
};

export const Message = {
    Get: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions),

    Create: (channel_id: string, params: {
        content?: string;
        nonce?: number | string;
        tts?: string;
        embeds?: types.Embed[];
        embed?: types.Embed;
        allowed_mentions?: types.AllowedMentions;
        message_reference?: types.MessageReference;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages), requestOptions, params),

    Crosspost: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.crosspost), requestOptions),

    Delete: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions),

    Edit: (channel_id: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        embed?: types.Embed;
        flags?: helpers.MessageFlags;
        allowed_mentions?: types.AllowedMentions;
        attachments?: types.Attachment[];
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions, params),

    Pin: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.pins, message_id), requestOptions),

    Unpin: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.pins, message_id), requestOptions),

    GetReactions: (channel_id: string, message_id: string, emoji: string, params?: {
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.User[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji)) + Query(params), requestOptions),

    DeleteAllReactions: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions), requestOptions),

    DeleteAllReactionsForEmoji: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji)), requestOptions),
};

export const Reaction = {
    Add: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), PATHS.me), requestOptions),

    DeleteOwn: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), PATHS.me), requestOptions),

    Delete: (channel_id: string, message_id: string, user_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), user_id), requestOptions),
};

export const GroupDM = {
    AddRecipient: (channel_id: string, user_id: string, params: {
        access_token: string;
        nick: string;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.recipients, user_id), requestOptions, params),

    RemoveRecipient: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.recipients, user_id), requestOptions),

    Modify: (id: string, params: {
        name?: string;
        icon?: string;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, Path(PATHS.channels, id), requestOptions, params),
};

export const Guild = {
    GetAuditLog: (guild_id: string, params?: {
        user_id?: string;
        action_type?: number;
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.AuditLog> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.auditLogs) + Query(params), requestOptions),

    ListEmojis: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Emoji[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.emojis), requestOptions),

    Create: (params: {
        name: string;
        region?: string;
        icon?: string;
        verification_level?: helpers.VerificationLevel;
        default_message_notifications?: helpers.DefaultMessageNotificationLevel;
        explicit_content_filter?: helpers.ExplicitContentFilterLevel;
        roles?: types.Role[];
        channels?: types.Channel[];
        afk_channel_id?: string;
        afk_timeout?: number;
        system_channel_id?: string;
        system_channel_flags?: helpers.SystemChannelFlags;
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.POST, PATHS.guilds, requestOptions, params),

    Get: (guild_id: string, params?: {
        with_counts?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id) + Query(params), requestOptions),

    GetPreview: (guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildPreview> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.preview), requestOptions),

    Modify: (guild_id: string, params: {
        name?: string;
        region?: string | null;
        verification_level?: helpers.VerificationLevel;
        default_message_notifications?: helpers.DefaultMessageNotificationLevel;
        explicit_content_filter?: helpers.ExplicitContentFilterLevel;
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
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id), requestOptions, params),

    Delete: (guild_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id), requestOptions),

    GetChannels: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Channel[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions),

    ModifyChannelPositions: (guild_id: string, params: ({
        id: string;
        position: number | null;
    })[], requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.channels), requestOptions, params),

    ListActiveThreads: (guild_id: string, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
    }> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.threads, PATHS.active), requestOptions),

    ListMembers: (guild_id: string, params?: {
        limit?: number;
        after?: string;
    }, requestOptions?: RequestOptions): Promise<types.Member[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members) + Query(params), requestOptions),

    SearchMembers: (guild_id: string, params: {
        query: number;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Member[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members, PATHS.search) + Query(params), requestOptions),

    GetBans: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Ban[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.bans), requestOptions),

    GetRoles: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Role[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions),

    ModifyRolePositions: (guild_id: string, params: ({
        id: string;
        position: number | null;
    })[], requestOptions?: RequestOptions): Promise<types.Role[]> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions, params),

    GetPruneCount: (guild_id: string, params?: {
        days?: number;
        include_roles?: string;
    }, requestOptions?: RequestOptions): Promise<{ pruned: number; }> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.prune) + Query(params), requestOptions),

    Prune: (guild_id: string, params?: {
        days?: number;
        compute_prune_count?: boolean;
        include_roles?: string;
        reason?: string;
    }, requestOptions?: RequestOptions): Promise<{ pruned: number | null; }> =>
        Request(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.prune), requestOptions, params),

    GetVoiceRegions: (guild_id: string, requestOptions?: RequestOptions): Promise<types.VoiceRegion[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.regions), requestOptions),

    GetInvites: (guild_id: string, requestOptions?: RequestOptions): Promise<(types.Invite & types.InviteMetadata)[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.invites), requestOptions),

    GetIntegrations: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Integration[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.integrations), requestOptions),

    DeleteIntegration: (guild_id: string, integration_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.integrations, integration_id), requestOptions),

    GetVanityURL: (guild_id: string, requestOptions?: RequestOptions): Promise<{ code: string; uses: number; }> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.vanity_url), requestOptions),

    CreateFromTemplate: (template_code: string, params: {
        name: string;
        icon?: string;
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.POST, Path(PATHS.guilds, PATHS.templates, template_code), requestOptions, params),

    GetTemplates: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Template[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.templates), requestOptions),

    GetWebhooks: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Webhook[]> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.webhooks), requestOptions),
};

export const Emoji = {
    Get: (guild_id: string, emoji_id: string, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions),

    Add: (guild_id: string, params: {
        name: string;
        image: string;
        roles?: string[];
    }, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.emojis), requestOptions, params),

    Modify: (guild_id: string, emoji_id: string, params: {
        name?: string;
        roles?: string[] | null;
    }, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions, params),

    Delete: (guild_id: string, emoji_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions),
};

export const Member = {
    Get: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<types.Member> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions),

    Add: (guild_id: string, user_id: string, params: {
        access_token: string;
        nick?: string;
        roles?: string[];
        mute?: boolean;
        deaf?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Member | null> =>
        Request(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions, params),

    Modify: (guild_id: string, user_id: string, params: {
        nick?: string | null;
        roles?: string[] | null;
        mute?: boolean | null;
        deaf?: boolean | null;
        channel_id?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Member> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions, params),

    ModifyCurrentNick: (guild_id: string, params: {
        nick?: string | null;
    }, requestOptions?: RequestOptions): Promise<string | null> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.members, PATHS.me, PATHS.nick), requestOptions, params),

    AddRole: (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.members, user_id, PATHS.roles, role_id), requestOptions),

    RemoveRole: (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.members, user_id, PATHS.roles, role_id), requestOptions),

    Remove: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions),
};

export const Ban = {
    Get: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<types.Ban> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions),

    Add: (guild_id: string, user_id: string, params?: {
        delete_message_days?: number;
        reason?: string;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions, params),

    Remove: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions),
};

export const Role = {
    Create: (guild_id: string, params?: {
        name?: string;
        permissions?: string;
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Role> =>
        Request(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions, params),

    Modify: (guild_id: string, role_id: string, params?: {
        name?: string | null;
        permissions?: string | null;
        color?: number | null;
        hoist?: boolean | null;
        mentionable?: boolean | null;
    }, requestOptions?: RequestOptions): Promise<types.Role> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.roles, role_id), requestOptions, params),

    Delete: (guild_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.roles, role_id), requestOptions),
};

export const Widget = {
    GetSettings: (guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildWidget> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget), requestOptions),

    Modify: (guild_id: string, params: types.GuildWidget, requestOptions?: RequestOptions): Promise<types.GuildWidget> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.widget), requestOptions, params),

    Get: (guild_id: string, requestOptions?: RequestOptions): Promise<object> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget_json), requestOptions),

    GetImage: (guild_id: string, params?: {
        style?: helpers.WidgetStyleOptions;
    }, requestOptions?: RequestOptions): Promise<Buffer> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget_png) + Query(params), requestOptions),
};

export const WelcomeScreen = {
    Get: (guild_id: string, requestOptions?: RequestOptions): Promise<types.WelcomeScreen> =>
        Request(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.welcome_screen), requestOptions),

    Modify: (guild_id: string, params: {
        enabled?: boolean | null;
        welcome_channels?: types.WelcomeScreenChannel[] | null;
        description?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.WelcomeScreen> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.welcome_screen), requestOptions, params),
};

export const Invite = {
    Create: (channel_id: string, params: {
        max_age?: number;
        max_uses?: number;
        temporary?: boolean;
        unique?: boolean;
        target_type?: helpers.InviteTargetTypes;
        target_user_id?: string;
        target_application_id?: string;
    }, requestOptions?: RequestOptions): Promise<types.Invite> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.invites), requestOptions, params),

    Get: (invite_code: string, params?: {
        with_counts?: boolean;
        with_expiration?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Invite> =>
        Request(METHODS.GET, Path(PATHS.invites, invite_code) + Query(params), requestOptions),

    Delete: (invite_code: string, requestOptions?: RequestOptions): Promise<types.Invite> =>
        Request(METHODS.DELETE, Path(PATHS.invites, invite_code), requestOptions),
};

export const Template = {
    Get: (template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.GET, Path(PATHS.guilds, PATHS.templates, template_code), requestOptions),

    Create: (guild_id: string, params: {
        name: string;
        description?: string;
    }, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.templates), requestOptions, params),

    Sync: (guild_id: string, template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions),

    Modify: (guild_id: string, template_code: string, params: {
        name?: string;
        description?: string;
    }, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions, params),

    Delete: (guild_id: string, template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions),
};

export const User = {
    GetCurrent: (requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.GET, Path(PATHS.users, PATHS.me), requestOptions),

    Get: (user_id: string, requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.GET, Path(PATHS.users, user_id), requestOptions),

    ModifyCurrent: (params: {
        username?: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.PATCH, Path(PATHS.users, PATHS.me), requestOptions, params),

    GetCurrentGuilds: (params?: {
        before?: string;
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Guild[]> =>
        Request(METHODS.GET, Path(PATHS.users, PATHS.me, PATHS.guilds) + Query(params), requestOptions),

    LeaveGuild: (guild_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.users, PATHS.me, PATHS.guilds, guild_id), requestOptions),

    CreateDM: (params: {
        recipient_id: string;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, Path(PATHS.users, PATHS.me, PATHS.channels), requestOptions, params),

    GetConnections: (requestOptions?: RequestOptions): Promise<types.Connection[]> =>
        Request(METHODS.GET, Path(PATHS.users, PATHS.me, PATHS.connections), requestOptions),
};

export const Voice = {
    ListRegions: (requestOptions?: RequestOptions): Promise<types.VoiceRegion[]> =>
        Request(METHODS.GET, Path(PATHS.voice, PATHS.regions), requestOptions),

    UpdateCurrentState: (guild_id: string, params: {
        channel_id: string;
        suppress?: boolean;
        request_to_speak_timestamp?: string | null;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.voice_states, PATHS.me), requestOptions, params),

    UpdateUserState: (guild_id: string, user_id: string, params: {
        channel_id: string;
        suppress?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.voice_states, user_id), requestOptions, params),
};

export const Webhook = {
    Create: (channel_id: string, params: {
        name: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.webhooks), requestOptions, params),

    Get: (webhook_id: string, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.GET, Path(PATHS.webhooks, webhook_id), requestOptions),

    GetWithToken: (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.GET, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions),

    Modify: (webhook_id: string, params: {
        name?: string;
        avatar?: string | null;
        channel_id?: string;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.PATCH, Path(PATHS.webhooks, webhook_id), requestOptions, params),

    ModifyWithToken: (webhook_id: string, webhook_token: string, params: {
        name?: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.PATCH, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions, params),

    Delete: (webhook_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.webhooks, webhook_id), requestOptions),

    DeleteWithToken: (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions),

    Execute: (webhook_id: string, webhook_token: string, params1: {
        content?: string;
        username?: string;
        avatar_url?: string;
        tts?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        components?: types.ActionRow[];
    }, params2?: {
        wait?: boolean;
        thread_id?: string;
    }, requestOptions?: RequestOptions): Promise<types.Message | null> =>
        Request(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token) + Query(params2), requestOptions, params1),

    ExecuteSlack: (webhook_id: string, webhook_token: string, params?: {
        wait?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.slack) + Query(params), requestOptions),

    ExecuteGitHub: (webhook_id: string, webhook_token: string, params?: {
        wait?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.github) + Query(params), requestOptions),

    GetMessage: (webhook_id: string, webhook_token: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id), requestOptions),

    EditMessage: (webhook_id: string, webhook_token: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        attachments?: types.Attachment[];
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id), requestOptions, params),

    DeleteMessage: (webhook_id: string, webhook_token: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id), requestOptions),
};

export const Application = {
    GetGlobalCommands: (application_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand[]> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.commands), requestOptions),

    CreateGlobalCommand: (application_id: string, params: {
        name: string;
        description: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.POST, Path(PATHS.applications, application_id, PATHS.commands), requestOptions, params),

    GetGlobalCommand: (application_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions),

    EditGlobalCommand: (application_id: string, command_id: string, params: {
        name?: string;
        description?: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.PATCH, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions, params),

    DeleteGlobalCommand: (application_id: string, command_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions),

    GetGuildCommands: (application_id: string, guild_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand[]> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands), requestOptions),

    CreateGuildCommand: (application_id: string, guild_id: string, params: {
        name: string;
        description: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.POST, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands), requestOptions, params),

    GetGuildCommand: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions),

    EditGuildCommand: (application_id: string, guild_id: string, command_id: string, params: {
        name?: string;
        description?: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.PATCH, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions, params),

    DeleteGuildCommand: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions),

    CreateInteractionResponse: (interaction_id: string, interaction_token: string, params: types.InteractionResponse, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, Path(PATHS.interactions, interaction_id, interaction_token, PATHS.callback), requestOptions, params),

    GetOriginalInteractionResponse: (application_id: string, interaction_token: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions),

    EditOriginalInteractionResponse: (application_id: string, interaction_token: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions, params),

    DeleteOriginalInteractionResponse: (application_id: string, interaction_token: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions),

    CreateFollowupMessage: (application_id: string, interaction_token: string, params: {
        content?: string;
        username?: string;
        avatar_url?: string;
        tts?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        flags?: helpers.InteractionResponseFlags;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message | null> =>
        Request(METHODS.POST, Path(PATHS.webhooks, application_id, interaction_token), requestOptions, params),

    GetFollowupMessage: (application_id: string, interaction_token: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions),

    EditFollowupMessage: (application_id: string, interaction_token: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions, params),

    DeleteFollowupMessage: (application_id: string, interaction_token: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions),

    GetGuildCommandPermissions: (application_id: string, guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions[]> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, PATHS.permissions), requestOptions),

    GetCommandPermissions: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions> =>
        Request(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id, PATHS.permissions), requestOptions),

    EditCommandPermissions: (application_id: string, guild_id: string, command_id: string, params: {
        permissions: types.ApplicationCommandPermissions[];
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id, PATHS.permissions), requestOptions, params),

    BatchEditCommandPermissions: (application_id: string, guild_id: string, params: {
        id: string;
        permissions: types.ApplicationCommandPermissions[];
    }[], requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions[]> =>
        Request(METHODS.PUT, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, PATHS.permissions), requestOptions, params),
};

export const OAuth2 = {
    TokenExchange: (params: ({
        client_id: string;
        client_secret: string;
        redirect_uri: string;
        scope: helpers.OAuth2Scopes | string;
    } & (
            {
                grant_type: helpers.OAuth2GrantTypes.AUTHORIZATION_CODE;
                code: string;
            } |
            {
                grant_type: helpers.OAuth2GrantTypes.REFRESH_TOKEN;
                refresh_token: string;
            }
        )
    ), requestOptions?: RequestOptions): Promise<{
        access_token: string;
        token_type: helpers.TokenTypes.BEARER;
        expires_in: number;
        refresh_token: string;
        scope: helpers.OAuth2Scopes | string;
    }> =>
        Request(METHODS.POST, Path(PATHS.oauth2, PATHS.token), requestOptions, Param(params)),

    GetCurrentApplicationInformation: (requestOptions?: RequestOptions): Promise<types.Application> =>
        Request(METHODS.GET, Path(PATHS.oauth2, PATHS.applications, PATHS.me), requestOptions),

    GetCurrentAuthorizationInformation: (requestOptions?: RequestOptions): Promise<{
        application: types.Application,
        scopes: string[];
        expires: string;
        user?: types.User;
    }> =>
        Request(METHODS.GET, Path(PATHS.oauth2, PATHS.me), requestOptions),
};

export const Thread = {
    Modify: (channel_id: string, params: {
        name?: string;
        archived?: boolean;
        auto_archive_duration?: helpers.ThreadArchiveDuration;
        locked?: boolean;
        rate_limit_per_user?: number | null;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, Path(PATHS.channels, channel_id), requestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id), requestOptions),

    StartWithMessage: (channel_id: string, message_id: string, params: {
        name: string;
        auto_archive_duration: helpers.ThreadArchiveDuration;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.threads), requestOptions, params),

    Start: (channel_id: string, params: {
        name: string;
        auto_archive_duration: helpers.ThreadArchiveDuration;
        type?: helpers.ChannelTypes.GUILD_PRIVATE_THREAD | helpers.ChannelTypes.GUILD_PUBLIC_THREAD | helpers.ChannelTypes.GUILD_NEWS_THREAD;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.threads), requestOptions, params),

    Join: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.thread_members, PATHS.me), requestOptions),

    AddMember: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.thread_members, user_id), requestOptions),

    Leave: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.thread_members, PATHS.me), requestOptions),

    RemoveMember: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.thread_members, user_id), requestOptions),

    ListMembers: (channel_id: string, requestOptions?: RequestOptions): Promise<types.ThreadMember[]> =>
        Request(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.thread_members), requestOptions),
};

export const StageInstance = {
    Create: (params: {
        channel_id: string;
        topic: string;
        privacy_level?: helpers.PrivacyLevel;
    }, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.POST, PATHS.stage_instances, requestOptions, params),

    Get: (channel_id: string, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.GET, Path(PATHS.stage_instances, channel_id), requestOptions),

    Modify: (channel_id: string, params: {
        topic?: string;
        privacy_level?: helpers.PrivacyLevel;
    }, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.PATCH, Path(PATHS.stage_instances, channel_id), requestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, Path(PATHS.stage_instances, channel_id), requestOptions),
};
