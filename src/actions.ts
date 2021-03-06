import { Request, RequestOptions } from './request';
import querystring from 'querystring';
import type * as helpers from './helpers';
import type * as types from './types';

let defaultRequestOptions: RequestOptions | undefined;
export const setDefaultRequestOptions = (requestOptions?: RequestOptions) => defaultRequestOptions = requestOptions;

const enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

const enum PATHS {
    me = '/@me',
    guilds = '/guilds',
    channels = '/channels',
    auditLogs = '/audit-logs',
    messages = '/messages',
    bulk_delete = '/bulk-delete',
    crosspost = '/crosspost',
    reactions = '/reactions',
    permissions = '/permissions',
    invites = '/invites',
    followers = '/followers',
    typing = '/typing',
    pins = '/pins',
    recipients = '/recipients',
    emojis = '/emojis',
    preview = '/preview',
    members = '/members',
    search = '/search',
    nick = '/nick',
    roles = '/roles',
    bans = '/bans',
    prune = '/prune',
    regions = '/regions',
    integrations = '/integrations',
    sync = '/sync',
    widget = '/widget',
    widget_json = '/widget.json',
    vanity_url = '/vanity-url',
    widget_png = '/widget.png',
    templates = '/templates',
    users = '/users',
    connections = '/connections',
    voice = '/voice',
    webhooks = '/webhooks',
    slack = '/slack',
    github = '/github',
    applications = '/applications',
    commands = '/commands',
    interactions = '/interactions',
    callback = '/callback',
    original = '/@original',
    voice_states = '/voice-states',
    oauth2 = '/oauth2',
    token = '/token',
    threads = '/threads',
    active = '/active',
    archived = '/archived',
    private = '/private',
    public = '/public',
    thread_members = '/thread-members',
    welcome_screen = '/welcome-screen',
    stage_instances = '/stage-instances',
}

const enum PATHS_S {
    me = PATHS.me + '/',
    guilds = PATHS.guilds + '/',
    channels = PATHS.channels + '/',
    messages = PATHS.messages + '/',
    reactions = PATHS.reactions + '/',
    permissions = PATHS.permissions + '/',
    invites = PATHS.invites + '/',
    pins = PATHS.pins + '/',
    recipients = PATHS.recipients + '/',
    emojis = PATHS.emojis + '/',
    members = PATHS.members + '/',
    roles = PATHS.roles + '/',
    bans = PATHS.bans + '/',
    integrations = PATHS.integrations + '/',
    templates = PATHS.templates + '/',
    users = PATHS.users + '/',
    webhooks = PATHS.webhooks + '/',
    applications = PATHS.applications + '/',
    commands = PATHS.commands + '/',
    interactions = PATHS.interactions + '/',
    voice_states = PATHS.voice_states + '/',
    threads = PATHS.threads + '/',
    archived = PATHS.archived + '/',
    thread_members = PATHS.thread_members + '/',
    stage_instances = PATHS.stage_instances + '/',
}

const enum PATHS_Q {
    auditLogs = PATHS.auditLogs + '?',
    prune = PATHS.prune + '?',
    widget_png = PATHS.widget_png + '?',
    guilds = PATHS.guilds + '?',
    members = PATHS.members + '?',
    search = PATHS.search + '?',
    slack = PATHS.slack + '?',
    github = PATHS.github + '?',
    public = PATHS.public + '?',
    private = PATHS.private + '?',
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
        Request(METHODS.POST, PATHS_S.guilds + guild_id + PATHS.channels, requestOptions ?? defaultRequestOptions, params),

    Get: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id, requestOptions ?? defaultRequestOptions),

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
        default_auto_archive_duration?: number | null;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, PATHS_S.channels + id, requestOptions ?? defaultRequestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id, requestOptions ?? defaultRequestOptions),

    GetMessages: (channel_id: string, params?: {
        around?: string;
        before?: string;
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Message[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.messages, requestOptions ?? defaultRequestOptions, params),

    BulkDeleteMessages: (channel_id: string, params: {
        messages: string[];
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.messages + PATHS.bulk_delete, requestOptions ?? defaultRequestOptions, params),

    EditPermissions: (channel_id: string, overwrite_id: string, params: {
        allow: string;
        deny: string;
        type: helpers.PermissionsOverwriteTypes,
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS_S.permissions + overwrite_id, requestOptions ?? defaultRequestOptions, params),

    GetInvites: (channel_id: string, requestOptions?: RequestOptions): Promise<(types.Invite & types.InviteMetadata)[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.invites, requestOptions ?? defaultRequestOptions),

    DeletePermission: (channel_id: string, overwrite_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.permissions + overwrite_id, requestOptions ?? defaultRequestOptions),

    FollowNews: (channel_id: string, params: {
        webhook_channel_id: string;
    }, requestOptions?: RequestOptions): Promise<types.FollowedChannel> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.followers, requestOptions ?? defaultRequestOptions, params),

    TriggerTypingIndicator: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.typing, requestOptions ?? defaultRequestOptions),

    GetPinnedMessages: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Message[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.pins, requestOptions ?? defaultRequestOptions),

    GetWebhooks: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Webhook[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.webhooks, requestOptions ?? defaultRequestOptions),

    ListActiveThreads: (channel_id: string, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.threads + PATHS.active, requestOptions ?? defaultRequestOptions),

    ListPublicArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.threads + PATHS.archived + PATHS_Q.public + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    ListPrivateArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.threads + PATHS.archived + PATHS_Q.private + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    ListJoinedPrivateArchivedThreads: (channel_id: string, params?: {
        before?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<{
        threads: types.Channel[];
        members: types.ThreadMember[];
        has_more: boolean;
    }> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.users + PATHS.me + PATHS.threads + PATHS.archived + PATHS_Q.private + querystring.stringify(params), requestOptions ?? defaultRequestOptions),
};

export const Message = {
    Get: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions),

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
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.messages, requestOptions ?? defaultRequestOptions, params),

    Crosspost: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS.crosspost, requestOptions ?? defaultRequestOptions),

    Delete: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions),

    Edit: (channel_id: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        embed?: types.Embed;
        flags?: helpers.MessageFlags;
        allowed_mentions?: types.AllowedMentions;
        attachments?: types.Attachment[];
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, PATHS_S.channels + channel_id + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions, params),

    Pin: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS_S.pins + message_id, requestOptions ?? defaultRequestOptions),

    Unpin: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.pins + message_id, requestOptions ?? defaultRequestOptions),

    GetReactions: (channel_id: string, message_id: string, emoji: string, params?: {
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.User[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS_S.reactions + encodeURIComponent(emoji) + '?' + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    DeleteAllReactions: (channel_id: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS.reactions, requestOptions ?? defaultRequestOptions),

    DeleteAllReactionsForEmoji: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS_S.reactions + encodeURIComponent(emoji), requestOptions ?? defaultRequestOptions),
};

export const Reaction = {
    Add: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS_S.reactions + encodeURIComponent(emoji) + PATHS.me, requestOptions ?? defaultRequestOptions),

    DeleteOwn: (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS_S.reactions + encodeURIComponent(emoji) + PATHS.me, requestOptions ?? defaultRequestOptions),

    Delete: (channel_id: string, message_id: string, user_id: string, emoji: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS_S.reactions + encodeURIComponent(emoji) + '/' + user_id, requestOptions ?? defaultRequestOptions),
};

export const GroupDM = {
    AddRecipient: (channel_id: string, user_id: string, params: {
        access_token: string;
        nick: string;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS_S.recipients + user_id, requestOptions ?? defaultRequestOptions, params),

    RemoveRecipient: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.recipients + user_id, requestOptions ?? defaultRequestOptions),

    Modify: (id: string, params: {
        name?: string;
        icon?: string;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, PATHS_S.channels + id, requestOptions ?? defaultRequestOptions, params),
};

export const Guild = {
    GetAuditLog: (guild_id: string, params?: {
        user_id: string;
        action_type: number;
        before: string;
        limit: number;
    }, requestOptions?: RequestOptions): Promise<types.AuditLog> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_Q.auditLogs + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    ListEmojis: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Emoji[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.emojis, requestOptions ?? defaultRequestOptions),

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
        Request(METHODS.POST, PATHS.guilds, requestOptions ?? defaultRequestOptions, params),

    Get: (guild_id: string, params?: {
        with_counts?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + '?' + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    GetPreview: (guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildPreview> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.preview, requestOptions ?? defaultRequestOptions),

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
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id, requestOptions ?? defaultRequestOptions, params),

    Delete: (guild_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id, requestOptions ?? defaultRequestOptions),

    GetChannels: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Channel[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.channels, requestOptions ?? defaultRequestOptions),

    ModifyChannelPositions: (guild_id: string, params: ({
        id: string;
        position: number | null;
    })[], requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.channels, requestOptions ?? defaultRequestOptions, params),

    ListMembers: (guild_id: string, params?: {
        limit?: number;
        after?: string;
    }, requestOptions?: RequestOptions): Promise<types.Member[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_Q.members + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    SearchMembers: (guild_id: string, params: {
        query: number;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Member[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.members + PATHS_Q.search + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    GetBans: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Ban[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.bans, requestOptions ?? defaultRequestOptions),

    GetRoles: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Role[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.roles, requestOptions ?? defaultRequestOptions),

    ModifyRolePositions: (guild_id: string, params: ({
        id: string;
        position: number | null;
    })[], requestOptions?: RequestOptions): Promise<types.Role[]> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.roles, requestOptions ?? defaultRequestOptions, params),

    GetPruneCount: (guild_id: string, params?: {
        days?: number;
        include_roles?: string;
    }, requestOptions?: RequestOptions): Promise<{ pruned: number; }> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_Q.prune + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    Prune: (guild_id: string, params?: {
        days?: number;
        compute_prune_count?: boolean;
        include_roles?: string;
        reason?: string;
    }, requestOptions?: RequestOptions): Promise<{ pruned: number | null; }> =>
        Request(METHODS.POST, PATHS_S.guilds + guild_id + PATHS.prune, requestOptions ?? defaultRequestOptions, params),

    GetVoiceRegions: (guild_id: string, requestOptions?: RequestOptions): Promise<types.VoiceRegion[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.regions, requestOptions ?? defaultRequestOptions),

    GetInvites: (guild_id: string, requestOptions?: RequestOptions): Promise<(types.Invite & types.InviteMetadata)[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.invites, requestOptions ?? defaultRequestOptions),

    GetIntegrations: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Integration[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.integrations, requestOptions ?? defaultRequestOptions),

    DeleteIntegration: (guild_id: string, integration_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.integrations + integration_id, requestOptions ?? defaultRequestOptions),

    GetVanityURL: (guild_id: string, requestOptions?: RequestOptions): Promise<{ code: string; uses: number; }> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.vanity_url, requestOptions ?? defaultRequestOptions),

    CreateFromTemplate: (template_code: string, params: {
        name: string;
        icon?: string;
    }, requestOptions?: RequestOptions): Promise<types.Guild> =>
        Request(METHODS.POST, PATHS.guilds + PATHS_S.templates + template_code, requestOptions ?? defaultRequestOptions, params),

    GetTemplates: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Template[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.templates, requestOptions ?? defaultRequestOptions),

    GetWebhooks: (guild_id: string, requestOptions?: RequestOptions): Promise<types.Webhook[]> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.webhooks, requestOptions ?? defaultRequestOptions),
};

export const Emoji = {
    Get: (guild_id: string, emoji_id: string, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_S.emojis + emoji_id, requestOptions ?? defaultRequestOptions),

    Add: (guild_id: string, params: {
        name: string;
        image: string;
        roles?: string[];
    }, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.POST, PATHS_S.guilds + guild_id + PATHS.emojis, requestOptions ?? defaultRequestOptions, params),

    Modify: (guild_id: string, emoji_id: string, params: {
        name?: string;
        roles?: string[] | null;
    }, requestOptions?: RequestOptions): Promise<types.Emoji> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS_S.emojis + emoji_id, requestOptions ?? defaultRequestOptions, params),

    Delete: (guild_id: string, emoji_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.emojis + emoji_id, requestOptions ?? defaultRequestOptions),
};

export const Member = {
    Get: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<types.Member> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_S.members + user_id, requestOptions ?? defaultRequestOptions),

    Add: (guild_id: string, user_id: string, params: {
        access_token: string;
        nick?: string;
        roles?: string[];
        mute?: boolean;
        deaf?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Member | null> =>
        Request(METHODS.PUT, PATHS_S.guilds + guild_id + PATHS_S.members + user_id, requestOptions ?? defaultRequestOptions, params),

    Modify: (guild_id: string, user_id: string, params: {
        nick?: string | null;
        roles?: string[] | null;
        mute?: boolean | null;
        deaf?: boolean | null;
        channel_id?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Member> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS_S.members + user_id, requestOptions ?? defaultRequestOptions, params),

    ModifyCurrentNick: (guild_id: string, params: {
        nick?: string | null;
    }, requestOptions?: RequestOptions): Promise<string | null> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.members + PATHS.me + PATHS.nick, requestOptions ?? defaultRequestOptions, params),

    AddRole: (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.guilds + guild_id + PATHS_S.members + user_id + PATHS_S.roles + role_id, requestOptions ?? defaultRequestOptions),

    RemoveRole: (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.members + user_id + PATHS_S.roles + role_id, requestOptions ?? defaultRequestOptions),

    Remove: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.members + user_id, requestOptions ?? defaultRequestOptions),
};

export const Ban = {
    Get: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<types.Ban> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_S.bans + user_id, requestOptions ?? defaultRequestOptions),

    Add: (guild_id: string, user_id: string, params?: {
        delete_message_days?: number;
        reason?: string;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.guilds + guild_id + PATHS_S.bans + user_id, requestOptions ?? defaultRequestOptions, params),

    Remove: (guild_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.bans + user_id, requestOptions ?? defaultRequestOptions),
};

export const Role = {
    Create: (guild_id: string, params?: {
        name?: string;
        permissions?: string;
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Role> =>
        Request(METHODS.POST, PATHS_S.guilds + guild_id + PATHS.roles, requestOptions ?? defaultRequestOptions, params),

    Modify: (guild_id: string, role_id: string, params?: {
        name?: string | null;
        permissions?: string | null;
        color?: number | null;
        hoist?: boolean | null;
        mentionable?: boolean | null;
    }, requestOptions?: RequestOptions): Promise<types.Role> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS_S.roles + role_id, requestOptions ?? defaultRequestOptions, params),

    Delete: (guild_id: string, role_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.roles + role_id, requestOptions ?? defaultRequestOptions),
};

export const Widget = {
    GetSettings: (guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildWidget> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.widget, requestOptions ?? defaultRequestOptions),

    Modify: (guild_id: string, params: types.GuildWidget, requestOptions?: RequestOptions): Promise<types.GuildWidget> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.widget, requestOptions ?? defaultRequestOptions, params),

    Get: (guild_id: string, requestOptions?: RequestOptions): Promise<object> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.widget_json, requestOptions ?? defaultRequestOptions),

    GetImage: (guild_id: string, params?: {
        style?: helpers.WidgetStyleOptions;
    }, requestOptions?: RequestOptions): Promise<Buffer> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS_Q.widget_png + querystring.stringify(params), requestOptions ?? defaultRequestOptions),
};

export const WelcomeScreen = {
    Get: (guild_id: string, requestOptions?: RequestOptions): Promise<types.WelcomeScreen> =>
        Request(METHODS.GET, PATHS_S.guilds + guild_id + PATHS.welcome_screen, requestOptions ?? defaultRequestOptions),

    Modify: (guild_id: string, params: {
        enabled?: boolean | null;
        welcome_channels?: types.WelcomeScreenChannel[] | null;
        description?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.WelcomeScreen> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.welcome_screen, requestOptions ?? defaultRequestOptions, params),
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
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.invites, requestOptions ?? defaultRequestOptions, params),

    Get: (invite_code: string, params?: {
        with_counts?: boolean;
        with_expiration?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.Invite> =>
        Request(METHODS.GET, PATHS_S.invites + invite_code + '?' + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    Delete: (invite_code: string, requestOptions?: RequestOptions): Promise<types.Invite> =>
        Request(METHODS.DELETE, PATHS_S.invites + invite_code, requestOptions ?? defaultRequestOptions),
};

export const Template = {
    Get: (template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.GET, PATHS.guilds + PATHS_S.templates + template_code, requestOptions ?? defaultRequestOptions),

    Create: (guild_id: string, params: {
        name: string;
        description?: string;
    }, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.POST, PATHS_S.guilds + guild_id + PATHS.templates, requestOptions ?? defaultRequestOptions, params),

    Sync: (guild_id: string, template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.PUT, PATHS_S.guilds + guild_id + PATHS_S.templates + template_code, requestOptions ?? defaultRequestOptions),

    Modify: (guild_id: string, template_code: string, params: {
        name?: string;
        description?: string;
    }, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS_S.templates + template_code, requestOptions ?? defaultRequestOptions, params),

    Delete: (guild_id: string, template_code: string, requestOptions?: RequestOptions): Promise<types.Template> =>
        Request(METHODS.DELETE, PATHS_S.guilds + guild_id + PATHS_S.templates + template_code, requestOptions ?? defaultRequestOptions),
};

export const User = {
    GetCurrent: (requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.GET, PATHS_S.users + PATHS.me, requestOptions ?? defaultRequestOptions),

    Get: (user_id: string, requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.GET, PATHS_S.users + user_id, requestOptions ?? defaultRequestOptions),

    ModifyCurrent: (params: {
        username?: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.User> =>
        Request(METHODS.PATCH, PATHS_S.users + PATHS.me, requestOptions ?? defaultRequestOptions, params),

    GetCurrentGuilds: (params?: {
        before?: string;
        after?: string;
        limit?: number;
    }, requestOptions?: RequestOptions): Promise<types.Guild[]> =>
        Request(METHODS.GET, PATHS_S.users + PATHS_S.me + PATHS_Q.guilds + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    LeaveGuild: (guild_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS.users + PATHS.me + PATHS_S.guilds + guild_id, requestOptions ?? defaultRequestOptions),

    CreateDM: (params: {
        recipient_id: string;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, PATHS.users + PATHS.me + PATHS.channels, requestOptions ?? defaultRequestOptions, params),

    GetConnections: (requestOptions?: RequestOptions): Promise<types.Connection[]> =>
        Request(METHODS.GET, PATHS.users + PATHS.me + PATHS.connections, requestOptions ?? defaultRequestOptions),
};

export const Voice = {
    ListRegions: (requestOptions?: RequestOptions): Promise<types.VoiceRegion[]> =>
        Request(METHODS.GET, PATHS.voice + PATHS.regions, requestOptions ?? defaultRequestOptions),

    UpdateCurrentState: (guild_id: string, params: {
        channel_id: string;
        suppress?: boolean;
        request_to_speak_timestamp?: string | null;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS.voice_states + PATHS.me, requestOptions ?? defaultRequestOptions, params),

    UpdateUserState: (guild_id: string, user_id: string, params: {
        channel_id: string;
        suppress?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PATCH, PATHS_S.guilds + guild_id + PATHS_S.voice_states + user_id, requestOptions ?? defaultRequestOptions, params),
};

export const Webhook = {
    Create: (channel_id: string, params: {
        name: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.webhooks, requestOptions ?? defaultRequestOptions, params),

    Get: (webhook_id: string, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.GET, PATHS_S.webhooks + webhook_id, requestOptions ?? defaultRequestOptions),

    GetWithToken: (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.GET, PATHS_S.webhooks + webhook_id + '/' + webhook_token, requestOptions ?? defaultRequestOptions),

    Modify: (webhook_id: string, params: {
        name?: string;
        avatar?: string | null;
        channel_id?: string;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.PATCH, PATHS_S.webhooks + webhook_id, requestOptions ?? defaultRequestOptions, params),

    ModifyWithToken: (webhook_id: string, webhook_token: string, params: {
        name?: string;
        avatar?: string | null;
    }, requestOptions?: RequestOptions): Promise<types.Webhook> =>
        Request(METHODS.PATCH, PATHS_S.webhooks + webhook_id + '/' + webhook_token, requestOptions ?? defaultRequestOptions, params),

    Delete: (webhook_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.webhooks + webhook_id, requestOptions ?? defaultRequestOptions),

    DeleteWithToken: (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.webhooks + webhook_id + '/' + webhook_token, requestOptions ?? defaultRequestOptions),

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
        Request(METHODS.POST, PATHS_S.webhooks + webhook_id + '/' + webhook_token + '?' + querystring.stringify(params2), requestOptions ?? defaultRequestOptions, params1),

    ExecuteSlack: (webhook_id: string, webhook_token: string, params?: {
        wait?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, PATHS_S.webhooks + webhook_id + '/' + webhook_token + PATHS_Q.slack + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    ExecuteGitHub: (webhook_id: string, webhook_token: string, params?: {
        wait?: boolean;
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, PATHS_S.webhooks + webhook_id + '/' + webhook_token + PATHS_Q.github + querystring.stringify(params), requestOptions ?? defaultRequestOptions),

    GetMessage: (webhook_id: string, webhook_token: string, message_id: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, PATHS_S.webhooks + webhook_id + '/' + webhook_token + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions),

    EditMessage: (webhook_id: string, webhook_token: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        attachments?: types.Attachment[];
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, PATHS_S.webhooks + webhook_id + '/' + webhook_token + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions, params),

    DeleteMessage: (webhook_id: string, webhook_token: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.webhooks + webhook_id + '/' + webhook_token + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions),
};

export const Application = {
    GetGlobalCommands: (application_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand[]> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS.commands, requestOptions ?? defaultRequestOptions),

    CreateGlobalCommand: (application_id: string, params: {
        name: string;
        description: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.POST, PATHS_S.applications + application_id + PATHS.commands, requestOptions ?? defaultRequestOptions, params),

    GetGlobalCommand: (application_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions),

    EditGlobalCommand: (application_id: string, command_id: string, params: {
        name?: string;
        description?: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.PATCH, PATHS_S.applications + application_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions, params),

    DeleteGlobalCommand: (application_id: string, command_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.applications + application_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions),

    GetGuildCommands: (application_id: string, guild_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand[]> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS.commands, requestOptions ?? defaultRequestOptions),

    CreateGuildCommand: (application_id: string, guild_id: string, params: {
        name: string;
        description: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.POST, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS.commands, requestOptions ?? defaultRequestOptions, params),

    GetGuildCommand: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions),

    EditGuildCommand: (application_id: string, guild_id: string, command_id: string, params: {
        name?: string;
        description?: string;
        options?: types.ApplicationCommandOption[];
        default_permission?: boolean;
    }, requestOptions?: RequestOptions): Promise<types.ApplicationCommand> =>
        Request(METHODS.PATCH, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions, params),

    DeleteGuildCommand: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS_S.commands + command_id, requestOptions ?? defaultRequestOptions),

    CreateInteractionResponse: (interaction_id: string, interaction_token: string, params: types.InteractionResponse, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.POST, PATHS_S.interactions + interaction_id + '/' + interaction_token + PATHS.callback, requestOptions ?? defaultRequestOptions, params),

    GetOriginalInteractionResponse: (application_id: string, interaction_token: string, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.GET, PATHS_S.webhooks + application_id + '/' + interaction_token + PATHS.messages + PATHS.original, requestOptions ?? defaultRequestOptions),

    EditOriginalInteractionResponse: (application_id: string, interaction_token: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, PATHS_S.webhooks + application_id + '/' + interaction_token + PATHS.messages + PATHS.original, requestOptions ?? defaultRequestOptions, params),

    DeleteOriginalInteractionResponse: (application_id: string, interaction_token: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.webhooks + application_id + '/' + interaction_token + PATHS.messages + PATHS.original, requestOptions ?? defaultRequestOptions),

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
        Request(METHODS.POST, PATHS_S.webhooks + application_id + '/' + interaction_token, requestOptions ?? defaultRequestOptions, params),

    EditFollowupMessage: (application_id: string, interaction_token: string, message_id: string, params: {
        content?: string;
        embeds?: types.Embed[];
        allowed_mentions?: types.AllowedMentions;
        components?: types.ActionRow[];
    }, requestOptions?: RequestOptions): Promise<types.Message> =>
        Request(METHODS.PATCH, PATHS_S.webhooks + application_id + '/' + interaction_token + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions, params),

    DeleteFollowupMessage: (application_id: string, interaction_token: string, message_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.webhooks + application_id + '/' + interaction_token + PATHS_S.messages + message_id, requestOptions ?? defaultRequestOptions),

    GetGuildCommandPermissions: (application_id: string, guild_id: string, requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions[]> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS.commands + PATHS.permissions, requestOptions ?? defaultRequestOptions),

    GetCommandPermissions: (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions> =>
        Request(METHODS.GET, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS_S.commands + command_id + PATHS.permissions, requestOptions ?? defaultRequestOptions),

    EditCommandPermissions: (application_id: string, guild_id: string, command_id: string, params: {
        permissions: types.ApplicationCommandPermissions[];
    }, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS_S.commands + command_id + PATHS.permissions, requestOptions ?? defaultRequestOptions, params),

    BatchEditCommandPermissions: (application_id: string, guild_id: string, params: {
        id: string;
        permissions: types.ApplicationCommandPermissions[];
    }[], requestOptions?: RequestOptions): Promise<types.GuildApplicationCommandPermissions[]> =>
        Request(METHODS.PUT, PATHS_S.applications + application_id + PATHS_S.guilds + guild_id + PATHS.commands + PATHS.permissions, requestOptions ?? defaultRequestOptions, params),
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
        Request(METHODS.POST, PATHS.oauth2 + PATHS.token, requestOptions ?? defaultRequestOptions, querystring.stringify(params)),

    GetCurrentApplicationInformation: (requestOptions?: RequestOptions): Promise<types.Application> =>
        Request(METHODS.GET, PATHS.oauth2 + PATHS.applications + PATHS.me, requestOptions ?? defaultRequestOptions),

    GetCurrentAuthorizationInformation: (requestOptions?: RequestOptions): Promise<{
        application: types.Application,
        scopes: string[];
        expires: string;
        user?: types.User;
    }> =>
        Request(METHODS.GET, PATHS.oauth2 + PATHS.me, requestOptions ?? defaultRequestOptions),
};

export const Thread = {
    Modify: (channel_id: string, params: {
        name?: string;
        archived?: boolean;
        auto_archive_duration?: types.ThreadArchiveDuration;
        locked?: boolean;
        rate_limit_per_user?: number | null;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.PATCH, PATHS_S.channels + channel_id, requestOptions ?? defaultRequestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id, requestOptions ?? defaultRequestOptions),

    StartWithMessage: (channel_id: string, message_id: string, params: {
        name: string;
        auto_archive_duration: types.ThreadArchiveDuration;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS_S.messages + message_id + PATHS.threads, requestOptions ?? defaultRequestOptions, params),

    Start: (channel_id: string, params: {
        name: string;
        auto_archive_duration: types.ThreadArchiveDuration;
        type?: helpers.ChannelTypes.GUILD_PRIVATE_THREAD | helpers.ChannelTypes.GUILD_PUBLIC_THREAD | helpers.ChannelTypes.GUILD_NEWS_THREAD;
    }, requestOptions?: RequestOptions): Promise<types.Channel> =>
        Request(METHODS.POST, PATHS_S.channels + channel_id + PATHS.threads, requestOptions ?? defaultRequestOptions, params),

    Join: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS.thread_members + PATHS.me, requestOptions ?? defaultRequestOptions),

    AddMember: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.PUT, PATHS_S.channels + channel_id + PATHS_S.thread_members + user_id, requestOptions ?? defaultRequestOptions),

    Leave: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS.thread_members + PATHS.me, requestOptions ?? defaultRequestOptions),

    RemoveMember: (channel_id: string, user_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.channels + channel_id + PATHS_S.thread_members + user_id, requestOptions ?? defaultRequestOptions),

    ListMembers: (channel_id: string, requestOptions?: RequestOptions): Promise<types.ThreadMember[]> =>
        Request(METHODS.GET, PATHS_S.channels + channel_id + PATHS.thread_members, requestOptions ?? defaultRequestOptions),
};

export const StageInstance = {
    Create: (params: {
        channel_id: string;
        topic: string;
        privacy_level?: helpers.PrivacyLevel;
    }, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.POST, PATHS.stage_instances, requestOptions ?? defaultRequestOptions, params),

    Get: (channel_id: string, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.GET, PATHS_S.stage_instances + channel_id, requestOptions ?? defaultRequestOptions),

    Modify: (channel_id: string, params: {
        topic?: string;
        privacy_level?: helpers.PrivacyLevel;
    }, requestOptions?: RequestOptions): Promise<types.StageInstance> =>
        Request(METHODS.PATCH, PATHS_S.stage_instances + channel_id, requestOptions ?? defaultRequestOptions, params),

    Delete: (channel_id: string, requestOptions?: RequestOptions): Promise<null> =>
        Request(METHODS.DELETE, PATHS_S.stage_instances + channel_id, requestOptions ?? defaultRequestOptions),
};
