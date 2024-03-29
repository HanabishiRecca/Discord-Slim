import { URLSearchParams } from 'url';

// @internal
export const
    Path = (...paths: string[]) => paths.join('/'),
    Param = (params: any) => String(new URLSearchParams(params)),
    Query = (params: any) => params ? '?' + Param(params) : '';

// @internal
export const enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

// @internal
export const enum PATHS {
    active = 'active',
    applications = 'applications',
    archived = 'archived',
    auditLogs = 'audit-logs',
    bans = 'bans',
    bot = 'bot',
    bulk_delete = 'bulk-delete',
    callback = 'callback',
    channels = 'channels',
    commands = 'commands',
    connections = 'connections',
    crosspost = 'crosspost',
    emojis = 'emojis',
    followers = 'followers',
    gateway = 'gateway',
    github = 'github',
    guilds = 'guilds',
    integrations = 'integrations',
    interactions = 'interactions',
    invites = 'invites',
    me = '@me',
    member = 'member',
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
    scheduled_events = 'scheduled-events',
    search = 'search',
    slack = 'slack',
    stage_instances = 'stage-instances',
    sticker_packs = 'sticker-packs',
    stickers = 'stickers',
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
