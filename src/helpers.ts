export const
    HOST = 'https://discord.com',
    API = `${HOST}/api` as const,
    API_VERSION = 9,
    API_PATH = `${API}/v${API_VERSION}` as const,
    CDN = 'https://cdn.discordapp.com';

export enum TokenTypes {
    BOT = 'Bot',
    BEARER = 'Bearer',
    NONE = '',
}

export const Permissions = {
    NO_PERMISSIONS: 0n,
    CREATE_INSTANT_INVITE: 1n,
    KICK_MEMBERS: 1n << 1n,
    BAN_MEMBERS: 1n << 2n,
    ADMINISTRATOR: 1n << 3n,
    MANAGE_CHANNELS: 1n << 4n,
    MANAGE_GUILD: 1n << 5n,
    ADD_REACTIONS: 1n << 6n,
    VIEW_AUDIT_LOG: 1n << 7n,
    PRIORITY_SPEAKER: 1n << 8n,
    STREAM: 1n << 9n,
    VIEW_CHANNEL: 1n << 10n,
    SEND_MESSAGES: 1n << 11n,
    SEND_TTS_MESSAGES: 1n << 12n,
    MANAGE_MESSAGES: 1n << 13n,
    EMBED_LINKS: 1n << 14n,
    ATTACH_FILES: 1n << 15n,
    READ_MESSAGE_HISTORY: 1n << 16n,
    MENTION_EVERYONE: 1n << 17n,
    USE_EXTERNAL_EMOJIS: 1n << 18n,
    VIEW_GUILD_INSIGHTS: 1n << 19n,
    CONNECT: 1n << 20n,
    SPEAK: 1n << 21n,
    MUTE_MEMBERS: 1n << 22n,
    DEAFEN_MEMBERS: 1n << 23n,
    MOVE_MEMBERS: 1n << 24n,
    USE_VAD: 1n << 25n,
    CHANGE_NICKNAME: 1n << 26n,
    MANAGE_NICKNAMES: 1n << 27n,
    MANAGE_ROLES: 1n << 28n,
    MANAGE_WEBHOOKS: 1n << 29n,
    MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
    USE_APPLICATION_COMMANDS: 1n << 31n,
    REQUEST_TO_SPEAK: 1n << 32n,
    MANAGE_EVENTS: 1n << 33n,
    MANAGE_THREADS: 1n << 34n,
    CREATE_PUBLIC_THREADS: 1n << 35n,
    CREATE_PRIVATE_THREADS: 1n << 36n,
    USE_EXTERNAL_STICKERS: 1n << 37n,
    SEND_MESSAGES_IN_THREADS: 1n << 38n,
    USE_EMBEDDED_ACTIVITIES: 1n << 39n,
    MODERATE_MEMBERS: 1n << 40n,
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

export enum Intents {
    SYSTEM = 0,
    GUILDS = 1 << 0,
    GUILD_MEMBERS = 1 << 1,
    GUILD_BANS = 1 << 2,
    GUILD_EMOJIS = 1 << 3,
    GUILD_INTEGRATIONS = 1 << 4,
    GUILD_WEBHOOKS = 1 << 5,
    GUILD_INVITES = 1 << 6,
    GUILD_VOICE_STATES = 1 << 7,
    GUILD_PRESENCES = 1 << 8,
    GUILD_MESSAGES = 1 << 9,
    GUILD_MESSAGE_REACTIONS = 1 << 10,
    GUILD_MESSAGE_TYPING = 1 << 11,
    DIRECT_MESSAGES = 1 << 12,
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    DIRECT_MESSAGE_TYPING = 1 << 14,
}

export enum AuditLogEvents {
    GUILD_UPDATE = 1,
    CHANNEL_CREATE = 10,
    CHANNEL_UPDATE = 11,
    CHANNEL_DELETE = 12,
    CHANNEL_OVERWRITE_CREATE = 13,
    CHANNEL_OVERWRITE_UPDATE = 14,
    CHANNEL_OVERWRITE_DELETE = 15,
    MEMBER_KICK = 20,
    MEMBER_PRUNE = 21,
    MEMBER_BAN_ADD = 22,
    MEMBER_BAN_REMOVE = 23,
    MEMBER_UPDATE = 24,
    MEMBER_ROLE_UPDATE = 25,
    MEMBER_MOVE = 26,
    MEMBER_DISCONNECT = 27,
    BOT_ADD = 28,
    ROLE_CREATE = 30,
    ROLE_UPDATE = 31,
    ROLE_DELETE = 32,
    INVITE_CREATE = 40,
    INVITE_UPDATE = 41,
    INVITE_DELETE = 42,
    WEBHOOK_CREATE = 50,
    WEBHOOK_UPDATE = 51,
    WEBHOOK_DELETE = 52,
    EMOJI_CREATE = 60,
    EMOJI_UPDATE = 61,
    EMOJI_DELETE = 62,
    MESSAGE_DELETE = 72,
    MESSAGE_BULK_DELETE = 73,
    MESSAGE_PIN = 74,
    MESSAGE_UNPIN = 75,
    INTEGRATION_CREATE = 80,
    INTEGRATION_UPDATE = 81,
    INTEGRATION_DELETE = 82,
    STAGE_INSTANCE_CREATE = 83,
    STAGE_INSTANCE_UPDATE = 84,
    STAGE_INSTANCE_DELETE = 85,
    STICKER_CREATE = 90,
    STICKER_UPDATE = 91,
    STICKER_DELETE = 92,
    GUILD_SCHEDULED_EVENT_CREATE = 100,
    GUILD_SCHEDULED_EVENT_UPDATE = 101,
    GUILD_SCHEDULED_EVENT_DELETE = 102,
    THREAD_CREATE = 110,
    THREAD_UPDATE = 111,
    THREAD_DELETE = 112,
}

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6,
    GUILD_NEWS_THREAD = 10,
    GUILD_PUBLIC_THREAD = 11,
    GUILD_PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
}

export enum MessageTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
}

export enum MessageActivityTypes {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5,
}

export enum MessageFlags {
    NO_FLAGS = 0,
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
    HAS_THREAD = 1 << 5,
    EPHEMERAL = 1 << 6,
    LOADING = 1 << 7,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
}

export enum MessageStickerFormatTypes {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
}

export enum PermissionsOverwriteTypes {
    ROLE = 0,
    MEMBER = 1,
}

export enum AllowedMentionTypes {
    ROLES = 'roles',
    USERS = 'users',
    EVERYONE = 'everyone',
}

export enum DefaultMessageNotificationLevels {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevels {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

export enum MFA_Levels {
    NONE = 0,
    ELEVATED = 1,
}

export enum VerificationLevels {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

export enum SystemChannelFlags {
    NO_FLAGS = 0,
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
}

export enum GuildFeatures {
    ANIMATED_BANNER = 'ANIMATED_BANNER',
    ANIMATED_ICON = 'ANIMATED_ICON',
    BANNER = 'BANNER',
    COMMERCE = 'COMMERCE',
    COMMUNITY = 'COMMUNITY',
    DISCOVERABLE = 'DISCOVERABLE',
    FEATURABLE = 'FEATURABLE',
    INVITE_SPLASH = 'INVITE_SPLASH',
    MEMBER_VERIFICATION_GATE_ENABLED = 'MEMBER_VERIFICATION_GATE_ENABLED',
    MONETIZATION_ENABLED = 'MONETIZATION_ENABLED',
    MORE_STICKERS = 'MORE_STICKERS',
    NEWS = 'NEWS',
    PARTNERED = 'PARTNERED',
    PREVIEW_ENABLED = 'PREVIEW_ENABLED',
    PRIVATE_THREADS = 'PRIVATE_THREADS',
    ROLE_ICONS = 'ROLE_ICONS',
    SEVEN_DAY_THREAD_ARCHIVE = 'SEVEN_DAY_THREAD_ARCHIVE',
    THREE_DAY_THREAD_ARCHIVE = 'THREE_DAY_THREAD_ARCHIVE',
    TICKETED_EVENTS_ENABLED = 'TICKETED_EVENTS_ENABLED',
    VANITY_URL = 'VANITY_URL',
    VERIFIED = 'VERIFIED',
    VIP_REGIONS = 'VIP_REGIONS',
    WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED',
}

export enum IntegrationExpireBehaviors {
    REMOVE_ROLE = 0,
    KICK = 1,
}

export enum PremiumTiers {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

export enum ActivityTypes {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM_STATUS = 4,
    COMPETING = 5,
}

export enum StatusTypes {
    ONLINE = 'online',
    DO_NOT_DISTURB = 'dnd',
    IDLE = 'idle',
    INVISIBLE = 'invisible',
    OFFLINE = 'offline',
}

export enum WidgetStyleOptions {
    SHIELD = 'shield',
    BANNER1 = 'banner1',
    BANNER2 = 'banner2',
    BANNER3 = 'banner3',
    BANNER4 = 'banner4',
}

export enum UserFlags {
    NO_FLAGS = 0,
    STAFF = 1 << 0,
    PARTNER = 1 << 1,
    HYPESQUAD = 1 << 2,
    BUG_HUNTER_LEVEL_1 = 1 << 3,
    HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
    HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
    HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
    PREMIUM_EARLY_SUPPORTER = 1 << 9,
    TEAM_PSEUDO_USER = 1 << 10,
    BUG_HUNTER_LEVEL_2 = 1 << 14,
    VERIFIED_BOT = 1 << 16,
    VERIFIED_DEVELOPER = 1 << 17,
    CERTIFIED_MODERATOR = 1 << 18,
    BOT_HTTP_INTERACTIONS = 1 << 19,
}

export enum PremiumTypes {
    NONE = 0,
    NITRO_CLASSIC = 1,
    NITRO = 2,
}

export enum VisibilityTypes {
    NONE = 0,
    EVERYONE = 1,
}

export enum WebhookTypes {
    INCOMING = 1,
    CHANNEL_FOLLOWER = 2,
    APPLICATION = 3,
}

export enum ActivityFlags {
    NO_FLAGS = 0,
    INSTANCE = 1 << 0,
    JOIN = 1 << 1,
    SPECTATE = 1 << 2,
    JOIN_REQUEST = 1 << 3,
    SYNC = 1 << 4,
    PLAY = 1 << 5,
    PARTY_PRIVACY_FRIENDS = 1 << 6,
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
    EMBEDDED = 1 << 8,
}

export enum ApplicationCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export enum ApplicationCommandPermissionTypes {
    ROLE = 1,
    USER = 2,
}

export enum InteractionTypes {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

export enum InteractionCallbackTypes {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9,
}

export enum OAuth2Scopes {
    ACTIVITIES_READ = 'activities.read',
    ACTIVITIES_WRITE = 'activities.write',
    APPLICATIONS_BUILDS_READ = 'applications.builds.read',
    APPLICATIONS_BUILDS_UPLOAD = 'applications.builds.upload',
    APPLICATIONS_COMMANDS = 'applications.commands',
    APPLICATIONS_COMMANDS_UPDATE = 'applications.commands.update',
    APPLICATIONS_STORE_UPDATE = 'applications.store.update',
    APPLICATIONS_ENTITLEMENTS = 'applications.entitlements',
    BOT = 'bot',
    CONNECTIONS = 'connections',
    EMAIL = 'email',
    GDM_JOIN = 'gdm.join',
    GUILDS = 'guilds',
    GUILDS_JOIN = 'guilds.join',
    GUILDS_MEMBERS_READ = 'guilds.members.read',
    IDENTIFY = 'identify',
    MESSAGES_READ = 'messages.read',
    RELATIONSHIPS_READ = 'relationships.read',
    RPC = 'rpc',
    RPC_ACTIVITIES_WRITE = 'rpc.activities.write',
    RPC_NOTIFICATIONS_READ = 'rpc.notifications.read',
    RPC_VOICE_READ = 'rpc.voice.read',
    RPC_VOICE_WRITE = 'rpc.voice.write',
    WEBHOOK_INCOMING = 'webhook.incoming',
}

export enum OAuth2GrantTypes {
    AUTHORIZATION_CODE = 'authorization_code',
    REFRESH_TOKEN = 'refresh_token',
}

export enum MembershipStates {
    INVITED = 1,
    ACCEPTED = 2,
}

export enum VoiceEncryptionModes {
    XSALSA20_POLY1305 = 'xsalsa20_poly1305',
    XSALSA20_POLY1305_SUFFIX = 'xsalsa20_poly1305_suffix',
    XSALSA20_POLY1305_LITE = 'xsalsa20_poly1305_lite',
}

export enum SpeakingStates {
    NO_FLAGS = 0,
    MICROPHONE = 1 << 0,
    SOUNDSHARE = 1 << 1,
    PRIORITY = 1 << 2,
}

export enum VideoQualityModes {
    AUTO = 1,
    FULL = 2,
}

export enum ComponentTypes {
    ACTION_ROW = 1,
    BUTTON = 2,
    SELECT_MENU = 3,
    TEXT_INPUT = 4,
}

export enum ButtonStyles {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
}

export enum PrivacyLevels {
    GUILD_ONLY = 2,
}

export enum GuildNSFWLevels {
    DEFAULT = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

export enum InviteTargetTypes {
    STREAM = 1,
    EMBEDDED_APPLICATION = 2,
}

export enum ApplicationFlags {
    NO_FLAGS = 0,
    GATEWAY_PRESENCE = 1 << 12,
    GATEWAY_PRESENCE_LIMITED = 1 << 13,
    GATEWAY_GUILD_MEMBERS = 1 << 14,
    GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
    VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
    EMBEDDED = 1 << 17,
    GATEWAY_MESSAGE_CONTENT = 1 << 18,
    GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
}

export enum TimestampStyles {
    SHORT_TIME = 't',
    LONG_TIME = 'T',
    SHORT_DATE = 'd',
    LONG_DATE = 'D',
    SHORT_DATE_TIME = 'f',
    LONG_DATE_TIME = 'F',
    RELATIVE_TIME = 'R',
}

export enum ThreadArchiveDurations {
    _1_HOUR = 60,
    _24_HOURS = 1440,
    _3_DAYS = 4320,
    _1_WEEK = 10080,
}

export enum ApplicationCommandTypes {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export enum StickerTypes {
    STANDARD = 1,
    GUILD = 2,
}

export enum ScheduledEventEntityTypes {
    STAGE_INSTANCE = 1,
    VOICE = 2,
    EXTERNAL = 3,
}

export enum ScheduledEventStatuses {
    SCHEDULED = 1,
    ACTIVE = 2,
    COMPLETED = 3,
    CANCELED = 4,
}

export enum TextInputStyles {
    SHORT = 1,
    PARAGRAPH = 2,
}

export enum Locales {
    DANISH = 'da',
    GERMAN = 'de',
    ENGLISH_UK = 'en-GB',
    ENGLISH_US = 'en-US',
    SPANISH = 'es-ES',
    FRENCH = 'fr',
    CROATIAN = 'hr',
    ITALIAN = 'it',
    LITHUANIAN = 'lt',
    HUNGARIAN = 'hu',
    DUTCH = 'nl',
    NORWEGIAN = 'no',
    POLISH = 'pl',
    PORTUGUESE_BRAZILIAN = 'pt-BR',
    ROMANIAN_ROMANIA = 'ro',
    FINNISH = 'fi',
    SWEDISH = 'sv-SE',
    VIETNAMESE = 'vi',
    TURKISH = 'tr',
    CZECH = 'cs',
    GREEK = 'el',
    BULGARIAN = 'bg',
    RUSSIAN = 'ru',
    UKRAINIAN = 'uk',
    HINDI = 'hi',
    THAI = 'th',
    CHINESE_CHINA = 'zh-CN',
    JAPANESE = 'ja',
    CHINESE_TAIWAN = 'zh-TW',
    KOREAN = 'ko',
};
