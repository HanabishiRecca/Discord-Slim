import type * as helpers from './helpers';

// Audit Log types

export type AuditLog = {
    webhooks: Webhook[];
    users: User[];
    audit_log_entries: AuditLogEntry[];
    integrations: Integration[];
};

export type AuditLogEntry = {
    target_id: string | null;
    changes?: AuditLogChange[];
    user_id: string;
    id: string;
    action_type: helpers.AuditLogEvents;
    options?: AuditEntryInfo[];
    reason?: string;
};

export type AuditEntryInfo = {
    delete_member_days?: string;
    members_removed?: string;
    channel_id?: string;
    message_id?: string;
    count?: string;
    id?: number;
    type?: string;
    role_name?: string;
};

export type AuditLogChange = {
    new_value?: (
        | AuditLogChangeKeyGuild
        | AuditLogChangeKeyChannel
        | AuditLogChangeKeyRole
        | AuditLogChangeKeyInvite
        | AuditLogChangeKeyUser
        | AuditLogChangeKeyIntegration
    );
    old_value?: (
        | AuditLogChangeKeyGuild
        | AuditLogChangeKeyChannel
        | AuditLogChangeKeyRole
        | AuditLogChangeKeyInvite
        | AuditLogChangeKeyUser
        | AuditLogChangeKeyIntegration
    );
    key: string;
};

export type AuditLogChangeKeyGuild = {
    id: string;
    type: string;
    name: string;
    icon_hash: string;
    splash_hash: string;
    owner_id: string;
    region: string;
    afk_channel_id: string;
    afk_timeout: number;
    mfa_level: number;
    verification_level: number;
    explicit_content_filter: helpers.ExplicitContentFilterLevel;
    default_message_notifications: helpers.DefaultMessageNotificationLevel;
    vanity_url_code: string;
    $add: AuditLogPartialRole[];
    $remove: AuditLogPartialRole[];
    prune_delete_days: number;
    widget_enabled: boolean;
    widget_channel_id: string;
    system_channel_id: string;
};

export type AuditLogPartialRole = {
    name: string;
    id: string;
};

export type AuditLogChangeKeyChannel = {
    id: string;
    type: helpers.ChannelTypes;
    position: number;
    topic: string;
    bitrate: number;
    permission_overwrites: PermissionsOverwrite[];
    nsfw: boolean;
    application_id: string;
    rate_limit_per_user: number;
};

export type AuditLogChangeKeyRole = {
    id: string;
    type: string;
    permissions: string;
    color: number;
    hoist: boolean;
    mentionable: boolean;
    allow: string;
    deny: string;
};

export type AuditLogChangeKeyInvite = {
    id: string;
    type: string;
    code: string;
    channel_id: string;
    inviter_id: string;
    max_uses: number;
    uses: number;
    max_age: number;
    temporary: boolean;
};

export type AuditLogChangeKeyUser = {
    id: string;
    type: string;
    deaf: boolean;
    mute: boolean;
    nick: string;
    avatar_hash: boolean;
};

export type AuditLogChangeKeyIntegration = {
    id: string;
    type: string;
    enable_emoticons: boolean;
    expire_behavior: number;
    expire_grace_period: number;
};

// Channel types

export type Channel = {
    id: string;
    type: helpers.ChannelTypes;
    guild_id?: string;
    position?: number;
    permission_overwrites?: PermissionsOverwrite[];
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: string | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: User[];
    icon?: string | null;
    owner_id?: string;
    application_id?: string;
    parent_id?: string | null;
    last_pin_timestamp?: string | null;
};

export type Message = {
    id: string;
    channel_id: string;
    guild_id?: string;
    author: User;
    member?: Member;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: (User & { member?: Member; })[];
    mention_roles: string[];
    mention_channels?: ChannelMention[];
    attachments: Attachment[];
    embeds: Embed[];
    reactions?: Reaction[];
    nonce?: number | string;
    pinned: boolean;
    webhook_id?: string;
    type: helpers.MessageTypes;
    activity?: MessageActivity;
    application?: MessageApplication;
    message_reference?: MessageReference;
    flags?: number;
    stickers?: MessageSticker[];
    referenced_message?: Message | null;
    interaction?: MessageInteraction;
};

export type MessageActivity = {
    type: helpers.MessageActivityTypes;
    party_id?: string;
};

export type MessageApplication = {
    id: string;
    cover_image?: string;
    description: string;
    icon: string | null;
    name: string;
};

export type MessageReference = {
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
};

export type MessageSticker = {
    id: string;
    pack_id: string;
    name: string;
    description: string;
    tags?: string;
    asset: string;
    preview_asset: string | null;
    format_type: helpers.MessageStickerFormatTypes;
};

export type FollowedChannel = {
    channel_id: string;
    webhook_id: string;
};

export type Reaction = {
    count: number;
    me: boolean;
    emoji: Emoji;
};

export type PermissionsOverwrite = {
    id: string;
    type: helpers.PermissionsOverwriteTypes;
    allow: string;
    deny: string;
};

export type Embed = {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedThumbnail;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];
};

export type EmbedThumbnail = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export type EmbedVideo = {
    url?: string;
    height?: number;
    width?: number;
};

export type EmbedImage = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export type EmbedProvider = {
    name?: string;
    url?: string;
};

export type EmbedAuthor = {
    name?: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
};

export type EmbedFooter = {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
};

export type EmbedField = {
    name: string;
    value: string;
    icon_url?: boolean;
};

export type Attachment = {
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
    height: number | null;
    width: number | null;
};

export type ChannelMention = {
    id: string;
    guild_id: string;
    type: number;
    name: string;
};

export type AllowedMentions = {
    parse: helpers.AllowedMentionTypes[];
    roles: string[];
    users: string[];
    replied_user: boolean;
};

// Emoji types

export type Emoji = {
    id: string | null;
    name: string | null;
    roles?: string[];
    user?: User;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
};

// Guild types

export type Guild = {
    id: string;
    name: string;
    icon: string | null;
    icon_hash?: string | null;
    splash: string | null;
    discovery_splash: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region: string;
    afk_channel_id: string | null;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: string | null;
    verification_level: helpers.VerificationLevel;
    default_message_notifications: helpers.DefaultMessageNotificationLevel;
    explicit_content_filter: helpers.ExplicitContentFilterLevel;
    roles: Role[];
    emojis: Emoji[];
    features: helpers.GuildFeatures[];
    mfa_level: helpers.MFA_Level;
    application_id: string | null;
    system_channel_id: string | null;
    system_channel_flags: helpers.SystemChannelFlags;
    rules_channel_id: string | null;
    joined_at?: string;
    large?: boolean;
    unavailable?: boolean;
    member_count?: number;
    voice_states?: VoiceState[];
    members?: Member[];
    channels?: Channel[];
    presences?: Presence[];
    max_presences?: number | null;
    max_members?: number;
    vanity_url_code: string | null;
    description: string | null;
    banner: string | null;
    premium_tier: helpers.PremiumTier;
    premium_subscription_count?: number;
    preferred_locale: string;
    public_updates_channel_id: string | null;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
};

export type UnavailableGuild = {
    id: string;
    unavailable: true;
};

export type GuildPreview = {
    id: string;
    name: string;
    icon: string | null;
    splash: string | null;
    discovery_splash: string | null;
    emojis: Emoji[];
    features: helpers.GuildFeatures[];
    approximate_member_count: number;
    approximate_presence_count: number;
    description: string | null;
};

export type GuildWidget = {
    enabled: boolean;
    channel_id: string | null;
};

export type Member = {
    user?: User;
    nick: string | null;
    roles: string[];
    joined_at: string;
    premium_since?: string | null;
    deaf: boolean;
    mute: boolean;
    pending?: boolean;
};

export type Integration = {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    syncing?: boolean;
    role_id?: string;
    enable_emoticons?: boolean;
    expire_behavior?: helpers.IntegrationExpireBehaviors;
    expire_grace_period?: number;
    user?: User;
    account: IntegrationAccount;
    synced_at?: string;
    subscriber_count?: number;
    revoked?: boolean;
    application?: IntegrationApplication;
};

export type IntegrationAccount = {
    id: string;
    name: string;
};

export type IntegrationApplication = {
    id: string;
    name: string;
    icon: string | null;
    description: string;
    summary: string;
    bot?: User;
};

export type Ban = {
    reason: string | null;
    user: User;
};

// Invite types

export type Invite = {
    code: string;
    guild?: Guild;
    channel: Channel;
    inviter?: User;
    target_user?: User;
    target_user_type?: helpers.TargetUserTypes;
    approximate_presence_count?: number;
    approximate_member_count?: number;
};

export type InviteMetadata = {
    uses: number;
    max_uses: number;
    max_age: number;
    temporary: boolean;
    created_at: string;
};

// Template types

export type Template = {
    code: string;
    name: string;
    description: string | null;
    usage_count: number;
    creator_id: string;
    creator: User;
    created_at: string;
    updated_at: string;
    source_guild_id: string;
    serialized_source_guild: Guild;
    is_dirty: boolean | null;
};

// User types

export type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: helpers.UserFlags;
    premium_type?: helpers.PremiumTypes;
    public_flags?: helpers.UserFlags;
};

export type Connection = {
    id: string;
    name: string;
    type: string;
    revoked?: boolean;
    integrations?: Integration[];
    verified: boolean;
    friend_sync: boolean;
    show_activity: boolean;
    visibility: helpers.VisibilityTypes;
};

// Role types

export type Role = {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: number;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags;
};

export type RoleTags = {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: boolean;
};

// Voice types

export type VoiceState = {
    guild_id?: string;
    channel_id: string | null;
    user_id: string;
    member?: Member;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
};

export type VoiceRegion = {
    id: string;
    name: string;
    vip: boolean;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
};

// Webhook types

export type Webhook = {
    id: string;
    type: helpers.WebhookTypes;
    guild_id?: string;
    channel_id: string;
    user?: User;
    name: string | null;
    avatar: string | null;
    token?: string;
    application_id: string | null;
};

// Slash commands types

export type ApplicationCommand = {
    id: string;
    application_id: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
};

export type ApplicationCommandOption = {
    type: helpers.ApplicationCommandOptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
};

export type ApplicationCommandOptionChoice = {
    name: string;
    value: string | number;
};

export type Interaction = {
    id: string;
    application_id: string;
    type: helpers.InteractionTypes;
    data?: ApplicationCommandInteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: Member;
    user?: User;
    token: string;
    version: number;
};

export type ApplicationCommandInteractionData = {
    id: string;
    name: string;
    options?: ApplicationCommandInteractionDataOption[];
};

export type ApplicationCommandInteractionDataOption = {
    name: string;
    value?: helpers.ApplicationCommandOptionTypes;
    options?: ApplicationCommandInteractionDataOption[];
};

export type InteractionResponse = {
    type: helpers.InteractionResponseTypes;
    data?: InteractionApplicationCommandCallbackData;
};

export type InteractionApplicationCommandCallbackData = {
    tts?: boolean;
    content?: string;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    flags?: helpers.InteractionResponseFlags;
};

export type MessageInteraction = {
    id: string;
    type: helpers.InteractionTypes;
    name: string;
    user: User;
};

// Gateway types

export type Presence = {
    user: { id: string; };
    guild_id?: string;
    status?: 'online' | 'dnd' | 'idle' | 'offline';
    activities?: Activity[];
    client_status?: ClientStatus;
};

export type Activity = {
    name: string;
    type: helpers.ActivityTypes;
    url?: string | null;
    created_at: number;
    timestamps?: ActivityTimestamps;
    application_id?: string;
    details?: string | null;
    state?: string | null;
    emoji?: ActivityEmoji;
    party?: ActivityParty;
    assets?: ActivityAssets;
    secrets?: ActivitySecrets;
    instance?: boolean;
    flags?: helpers.ActivityFlags;
};

export type ActivityTimestamps = {
    start?: number;
    end?: number;
};

export type ActivityEmoji = {
    name: string;
    id?: string;
    animated?: boolean;
};

export type ActivityParty = {
    id?: string;
    size?: [number, number];
};

export type ActivityAssets = {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
};

export type ActivitySecrets = {
    join?: string;
    spectate?: string;
    match?: string;
};

export type ClientStatus = {
    desktop?: string;
    mobile?: string;
    web?: string;
};
