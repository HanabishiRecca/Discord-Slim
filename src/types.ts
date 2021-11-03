import type * as helpers from './helpers';

// Audit Log types

export type AuditLog = {
    audit_log_entries: AuditLogEntry[];
    integrations: Integration[];
    threads: Channel[];
    users: User[];
    webhooks: Webhook[];
};

export type AuditLogEntry = {
    target_id: string | null;
    changes?: AuditLogChange[];
    user_id: string | null;
    id: string;
    action_type: helpers.AuditLogEvents;
    options?: AuditEntryInfo[];
    reason?: string;
};

export type AuditEntryInfo = {
    channel_id?: string;
    count?: string;
    delete_member_days?: string;
    id?: number;
    members_removed?: string;
    message_id?: string;
    role_name?: string;
    type?: string;
};

export type AuditLogChange = {
    new_value?: AuditLogChangeKey;
    old_value?: AuditLogChangeKey;
    key: string;
};

export type AuditLogChangeKey = (
    | AuditLogChangeKeyGuild
    | AuditLogChangeKeyChannel
    | AuditLogChangeKeyRole
    | AuditLogChangeKeyInvite
    | AuditLogChangeKeyUser
    | AuditLogChangeKeyIntegration
    | AuditLogChangeKeyVoiceChannel
    | AuditLogChangeKeySticker
    | AuditLogChangeStageInstance
);

export type AuditLogChangeKeyGuild = {
    afk_channel_id: string;
    afk_timeout: number;
    banner_hash: string;
    default_message_notifications: helpers.DefaultMessageNotificationLevel;
    description: string;
    discovery_splash_hash: string;
    explicit_content_filter: helpers.ExplicitContentFilterLevel;
    icon_hash: string;
    id: string;
    mfa_level: number;
    name: string;
    owner_id: string;
    preferred_locale: string;
    prune_delete_days: number;
    public_updates_channel_id: string;
    rules_channel_id: string;
    splash_hash: string;
    system_channel_id: string;
    type: string;
    vanity_url_code: string;
    verification_level: number;
    widget_channel_id: string;
    widget_enabled: boolean;
    $add: AuditLogPartialRole[];
    $remove: AuditLogPartialRole[];
};

export type AuditLogPartialRole = {
    icon_hash: string;
    id: string;
    name: string;
    unicode_emoji: string;
};

export type AuditLogChangeKeyChannel = {
    application_id: string;
    bitrate: number;
    id: string;
    name: string;
    nsfw: boolean;
    permission_overwrites: PermissionsOverwrite[];
    position: number;
    rate_limit_per_user: number;
    topic: string;
    type: helpers.ChannelTypes;
};

export type AuditLogChangeKeyRole = {
    allow: string;
    color: number;
    deny: string;
    hoist: boolean;
    id: string;
    mentionable: boolean;
    name: string;
    permissions: string;
    type: string;
};

export type AuditLogChangeKeyInvite = {
    channel_id: string;
    code: string;
    id: string;
    inviter_id: string;
    max_age: number;
    max_uses: number;
    name: string;
    temporary: boolean;
    type: string;
    uses: number;
};

export type AuditLogChangeKeyUser = {
    avatar_hash: boolean;
    deaf: boolean;
    id: string;
    mute: boolean;
    name: string;
    nick: string;
    type: string;
};

export type AuditLogChangeKeyIntegration = {
    enable_emoticons: boolean;
    expire_behavior: number;
    expire_grace_period: number;
    id: string;
    name: string;
    type: string;
};

export type AuditLogChangeKeyVoiceChannel = {
    id: string;
    name: string;
    type: string;
    user_limit: number;
};

export type AuditLogChangeKeySticker = {
    available: boolean;
    description: string;
    format_type: helpers.MessageStickerFormatTypes;
    guild_id: string;
    id: string;
    name: string;
    tags: string;
    type: string;
};

export type AuditLogChangeStageInstance = {
    id: string;
    name: string;
    privacy_level: helpers.PrivacyLevel;
    topic: string;
    type: helpers.ChannelTypes;
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
    rtc_region?: string | null;
    video_quality_mode?: helpers.VideoQualityModes;
    message_count?: number;
    member_count?: number;
    thread_metadata?: ThreadMetadata;
    member?: ThreadMember;
    default_auto_archive_duration?: helpers.ThreadArchiveDuration;
    permissions?: string;
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
    application?: Application;
    application_id?: string;
    message_reference?: MessageReference;
    flags?: helpers.MessageFlags;
    referenced_message?: Message | null;
    interaction?: MessageInteraction;
    thread?: Channel;
    components?: ActionRow[];
    sticker_items?: StickerItem[];
    stickers?: Sticker[];
};

export type MessageActivity = {
    type: helpers.MessageActivityTypes;
    party_id?: string;
};

export type MessageReference = {
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
    fail_if_not_exists?: boolean;
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

export type ThreadMetadata = {
    archived: boolean;
    auto_archive_duration: helpers.ThreadArchiveDuration;
    archive_timestamp: string;
    locked: boolean;
    invitable?: boolean;
};

export type ThreadMember = {
    id?: string;
    user_id?: string;
    join_timestamp: string;
    flags: number;
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
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export type EmbedVideo = {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export type EmbedImage = {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export type EmbedProvider = {
    name?: string;
    url?: string;
};

export type EmbedAuthor = {
    name: string;
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
    inline?: boolean;
};

export type Attachment = {
    id: string;
    filename: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number | null;
    width?: number | null;
    ephemeral?: boolean;
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
    threads?: Channel[];
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
    welcome_screen?: WelcomeScreen;
    nsfw_level: helpers.GuildNSFWLevel;
    stage_instances?: StageInstance[];
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
    nick?: string | null;
    avatar?: string | null;
    roles: string[];
    joined_at: string;
    premium_since?: string | null;
    deaf: boolean;
    mute: boolean;
    pending?: boolean;
    permissions?: string;
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

export type WelcomeScreen = {
    description: string | null;
    welcome_channels: WelcomeScreenChannel[];
};

export type WelcomeScreenChannel = {
    channel_id: string;
    description: string;
    emoji_id: string | null;
    emoji_name: string | null;
};

// Invite types

export type Invite = {
    code: string;
    guild?: Guild;
    channel: Channel;
    inviter?: User;
    target_type?: helpers.InviteTargetTypes;
    target_user?: User;
    target_application?: Application;
    approximate_presence_count?: number;
    approximate_member_count?: number;
    expires_at?: string | null;
    stage_instance?: InviteStageInstance;
};

export type InviteMetadata = {
    uses: number;
    max_uses: number;
    max_age: number;
    temporary: boolean;
    created_at: string;
};

export type InviteStageInstance = {
    members: Member[];
    participant_count: number;
    speaker_count: number;
    topic: string;
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
    banner?: string | null;
    accent_color?: number | null;
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
    icon?: string | null;
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags;
};

export type RoleTags = {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: boolean | null;
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
    request_to_speak_timestamp: string | null;
};

export type VoiceRegion = {
    id: string;
    name: string;
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
    source_guild?: Guild;
    source_channel?: Channel;
    url?: string;
};

// Application commands types

export type ApplicationCommand = {
    id: string;
    type?: helpers.ApplicationCommandTypes;
    application_id: string;
    guild_id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    default_permission?: boolean;
    version: string;
};

export type ApplicationCommandOption = {
    type: helpers.ApplicationCommandOptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
    channel_types?: helpers.ChannelTypes[];
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;
};

export type ApplicationCommandOptionChoice = {
    name: string;
    value: string | number;
};

export type GuildApplicationCommandPermissions = {
    id: string;
    application_id: string;
    guild_id: string;
    permissions: ApplicationCommandPermissions[];
};

export type ApplicationCommandPermissions = {
    id: string;
    type: helpers.ApplicationCommandPermissionType;
    permission: boolean;
};

export type Interaction = {
    id: string;
    application_id: string;
    type: helpers.InteractionTypes;
    data?: InteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: Member;
    user?: User;
    token: string;
    version: number;
    message?: Message;
};

export type InteractionData = {
    id: string;
    name: string;
    type?: helpers.ApplicationCommandTypes;
    resolved?: InteractionDataResolved;
    options?: InteractionDataOption[];
    custom_id?: string;
    component_type?: helpers.ComponentTypes;
    values?: SelectOption[];
    target_id?: string;
};

export type InteractionDataResolved = {
    users?: { [id: string]: User; };
    members?: { [id: string]: Member; };
    roles?: { [id: string]: Role; };
    channels?: { [id: string]: Channel; };
    messages?: { [id: string]: Message; };
};

export type InteractionDataOption = {
    name: string;
    type: helpers.ApplicationCommandOptionTypes;
    value?: string | number | boolean;
    options?: InteractionDataOption[];
    focused?: boolean;
};

export type MessageInteraction = {
    id: string;
    type: helpers.InteractionTypes;
    name: string;
    user: User;
};

export type InteractionResponse = {
    type: helpers.InteractionCallbackTypes.PONG;
} | {
    type: (
        | helpers.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE
        | helpers.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        | helpers.InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE
        | helpers.InteractionCallbackTypes.UPDATE_MESSAGE
    );
    data: InteractionCallbackData;
} | {
    type: helpers.InteractionCallbackTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
    data: InteractionAutocompleteCallbackData;
};

export type InteractionCallbackData = {
    tts?: boolean;
    content?: string;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    flags?: helpers.InteractionCallbackDataFlags;
    components?: ActionRow[];
    attachments?: Attachment[];
};

export type InteractionAutocompleteCallbackData = {
    choices: ApplicationCommandOptionChoice[];
};

// Gateway types

export type Presence = {
    user: { id: string; };
    guild_id?: string;
    status?: helpers.StatusTypes;
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

// OAuth2 types

export type Application = {
    id: string;
    name: string;
    icon: string | null;
    description: string;
    rpc_origins?: string[];
    bot_public: boolean;
    bot_require_code_grant: boolean;
    terms_of_service_url?: string;
    privacy_policy_url?: string;
    owner?: User;
    summary: string;
    verify_key: string;
    team: Team | null;
    guild_id?: string;
    primary_sku_id?: string;
    slug?: string;
    cover_image?: string;
    flags?: helpers.ApplicationFlags;
};

export type Team = {
    icon: string | null;
    id: string;
    members: TeamMember[];
    owner_user_id: string;
};

export type TeamMember = {
    membership_state: helpers.MembershipStates;
    permissions: string[];
    team_id: string;
    user: User;
};

// Message Components types

export type ActionRow = {
    type: helpers.ComponentTypes.ACTION_ROW;
    components: (Button | SelectMenu)[];
};

export type Button = {
    type: helpers.ComponentTypes.BUTTON;
    style: helpers.ButtonStyles;
    label?: string;
    emoji?: Emoji;
    custom_id?: string;
    url?: string;
    disabled?: boolean;
};

export type SelectMenu = {
    type: helpers.ComponentTypes.SELECT_MENU;
    custom_id: string;
    options: SelectOption[];
    placeholder?: string;
    min_values: number;
    max_values: number;
    disabled?: boolean;
};

export type SelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: Emoji;
    default?: boolean;
};

// Stage Instance types

export type StageInstance = {
    id: string;
    guild_id: string;
    channel_id: string;
    topic: string;
    privacy_level: helpers.PrivacyLevel;
    discoverable_disabled: boolean;
};

// Sticker types

export type Sticker = {
    id: string;
    pack_id?: string;
    name: string;
    description: string | null;
    tags: string;
    type: helpers.StickerTypes;
    format_type: helpers.MessageStickerFormatTypes;
    available?: boolean;
    guild_id?: string;
    user?: User;
    sort_value?: number;
};

export type StickerItem = {
    id: string;
    name: string;
    format_type: helpers.MessageStickerFormatTypes;
};

export type StickerPack = {
    id: string;
    stickers: Sticker[];
    name: string;
    sku_id: string;
    cover_sticker_id?: string;
    description: string;
    banner_asset_id: string;
};
